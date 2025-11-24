import path from 'node:path'
import fs from 'node:fs/promises'
import { pathToFileURL, fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

import postcss from 'postcss'
import fg from 'fast-glob'
import { compile } from 'tailwindcss'
import { parse } from '@babel/parser'
import traverseModule from '@babel/traverse'

const require = createRequire(import.meta.url)
const projectRoot = process.cwd()
const debugTailwind = process.env.DEBUG_TAILWIND_POSTCSS === '1'
const traverse = traverseModule.default ?? traverseModule

const JS_EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs', '.mts', '.cts'])
const HTML_EXTENSIONS = new Set(['.html', '.htm'])
const TOKEN_PATTERN = /[A-Za-z0-9!/%#._:[\]-]+/g

function normalizeBase(base) {
  if (!base) return projectRoot
  if (base.startsWith('file://')) {
    return fileURLToPath(base)
  }
  return base
}

function resolveRequest(specifier, base = projectRoot) {
  if (specifier.startsWith('data:')) {
    return specifier
  }
  if (specifier.startsWith('http://') || specifier.startsWith('https://')) {
    throw new Error(`Remote stylesheets are not supported: ${specifier}`)
  }
  if (specifier.startsWith('/') || specifier.startsWith('.')) {
    return path.resolve(base, specifier)
  }
  return require.resolve(specifier, { paths: [base] })
}

function resolveStylesheet(specifier, base) {
  if (specifier === 'tailwindcss') {
    return resolveRequest('tailwindcss/index.css', base)
  }
  try {
    return resolveRequest(specifier, base)
  } catch (error) {
    if (!path.extname(specifier)) {
      return resolveRequest(`${specifier}.css`, base)
    }
    throw error
  }
}

function createModuleLoader(tracked) {
  return async (id, base = projectRoot) => {
    const normalizedBase = normalizeBase(base)
    if (debugTailwind) {
      console.error('[tailwindcss-lite] loadModule', id, 'base:', normalizedBase)
    }
    const resolved = resolveRequest(id, normalizedBase)
    tracked.add(resolved)
    const mod = await import(pathToFileURL(resolved).href)
    return {
      path: resolved,
      base: path.dirname(resolved),
      module: mod.default ?? mod,
    }
  }
}

function createStylesheetLoader(tracked) {
  return async (id, base = projectRoot) => {
    if (id.startsWith('data:')) {
      const [, payload] = id.split(',')
      const content = Buffer.from(payload, 'base64').toString('utf8')
      return { path: id, base, content }
    }
    const normalizedBase = normalizeBase(base)
    if (debugTailwind) {
      console.error('[tailwindcss-lite] loadStylesheet', id, 'base:', normalizedBase)
    }
    const resolved = resolveStylesheet(id, normalizedBase)
    tracked.add(resolved)
    const content = await fs.readFile(resolved, 'utf8')
    return {
      path: resolved,
      base: path.dirname(resolved),
      content,
    }
  }
}

async function collectCandidates(sources, result) {
  if (!sources || sources.length === 0) {
    return []
  }

  const grouped = new Map()
  const watchedDirs = new Set()

  for (const source of sources) {
    if (!source.pattern || source.pattern === 'none') continue
    const base = source.base ?? projectRoot
    watchedDirs.add(base)
    const bucket = grouped.get(base) ?? { include: [], exclude: [] }
    if (source.negated) {
      bucket.exclude.push(source.pattern)
    } else {
      bucket.include.push(source.pattern)
    }
    grouped.set(base, bucket)
  }

  for (const dir of watchedDirs) {
    result.messages.push({ type: 'dir-dependency', plugin: 'tailwindcss-lite', dir })
  }

  const files = new Set()
  for (const [base, patterns] of grouped) {
    if (patterns.include.length === 0) continue
    const matches = await fg(patterns.include, {
      cwd: base,
      absolute: true,
      dot: true,
      ignore: patterns.exclude,
    })
    matches.forEach((match) => files.add(path.normalize(match)))
  }

  const candidates = new Set()
  for (const filePath of files) {
    const content = await fs.readFile(filePath, 'utf8')
    extractCandidatesFromContent(content, filePath).forEach((token) => candidates.add(token))
    result.messages.push({ type: 'dependency', plugin: 'tailwindcss-lite', file: filePath })
  }

  return [...candidates]
}

function extractCandidatesFromContent(content, filePath) {
  const extension = path.extname(filePath).toLowerCase()
  if (JS_EXTENSIONS.has(extension)) {
    return extractFromJsLike(content, filePath)
  }
  if (HTML_EXTENSIONS.has(extension)) {
    return extractFromHtml(content)
  }
  return extractFromGeneric(content)
}

function extractFromJsLike(content, filePath) {
  const tokens = new Set()
  try {
    const ast = parse(content, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript', 'decorators-legacy'],
    })

    traverse(ast, {
      StringLiteral({ node }) {
        collectFromString(node.value, tokens)
      },
      TemplateLiteral({ node }) {
        node.quasis.forEach((quasi) => {
          collectFromString(quasi.value.cooked ?? quasi.value.raw ?? '', tokens)
        })
      },
    })
  } catch {
    return extractFromGeneric(content)
  }
  return tokens
}

function extractFromHtml(content) {
  const tokens = new Set()
  const attrRegex = /\bclass(?:Name)?\s*=\s*(["'`])([\s\S]*?)\1/g
  let match
  while ((match = attrRegex.exec(content)) !== null) {
    collectFromString(match[2], tokens)
  }
  return tokens
}

function extractFromGeneric(content) {
  const tokens = new Set()
  collectFromString(content, tokens)
  return tokens
}

function collectFromString(value, target) {
  if (!value) return
  const matches = value.match(TOKEN_PATTERN)
  if (!matches) return
  matches.forEach((token) => {
    const trimmed = token.trim()
    if (!trimmed) return
    if (/^[0-9]+$/.test(trimmed)) return
    target.add(trimmed)
  })
}

export default function tailwindPostcss() {
  return {
    postcssPlugin: 'tailwindcss-lite',
    async Once(root, { result }) {
      const from = result.opts.from ?? path.resolve(projectRoot, 'src/index.css')
      const trackedFiles = new Set()

      const compilation = await compile(root.toString(), {
        from,
        base: path.dirname(from),
        loadModule: createModuleLoader(trackedFiles),
        loadStylesheet: createStylesheetLoader(trackedFiles),
      })

      const candidates = await collectCandidates(compilation.sources, result)

      trackedFiles.forEach((filePath) => {
        if (filePath.startsWith('data:')) return
        result.messages.push({ type: 'dependency', plugin: 'tailwindcss-lite', file: filePath })
      })

      const builtCss = compilation.build(candidates)
      const parsed = postcss.parse(builtCss, { from })
      root.removeAll()
      root.append(...parsed.nodes)
    },
  }
}

tailwindPostcss.postcss = true
