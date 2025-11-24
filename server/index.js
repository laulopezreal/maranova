import http from 'node:http'
import { randomBytes } from 'node:crypto'
import { URL } from 'node:url'

const PORT = process.env.API_PORT ? Number(process.env.API_PORT) : 8787
const HOST = process.env.API_HOST || '0.0.0.0'

const providerConfig = {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    authorizeUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    scope: 'openid email profile',
  },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    authorizeUrl: 'https://github.com/login/oauth/authorize',
    tokenUrl: 'https://github.com/login/oauth/access_token',
    scope: 'read:user user:email',
  },
  apple: {
    clientId: process.env.APPLE_CLIENT_ID,
    clientSecret: process.env.APPLE_CLIENT_SECRET,
    authorizeUrl: 'https://appleid.apple.com/auth/authorize',
    tokenUrl: 'https://appleid.apple.com/auth/token',
    scope: 'name email',
  },
}

const accents = {
  google: { accent: 'rgba(251, 191, 36, 0.65)', avatarColor: 'rgba(251, 191, 36, 0.28)' },
  github: { accent: 'rgba(94, 234, 212, 0.65)', avatarColor: 'rgba(45, 212, 191, 0.25)' },
  apple: { accent: 'rgba(255, 255, 255, 0.75)', avatarColor: 'rgba(255, 255, 255, 0.18)' },
}

const sessionStore = new Map()
const stateStore = new Map()

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host}`)

  if (req.method === 'POST' && url.pathname === '/api/auth/start') {
    const body = await readJson(req, res)
    if (!body) return
    const { provider, codeChallenge } = body
    const cfg = providerConfig[provider]
    if (!cfg || !cfg.clientId || !cfg.clientSecret) {
      return sendJson(res, 400, {
        error: 'Unsupported provider or missing config',
      })
    }
    if (!codeChallenge) return sendJson(res, 400, { error: 'codeChallenge required' })

    const state = randomState()
    const redirectUri = appendProvider(resolveRedirectBase(req), provider)
    const authorizationUrl = buildAuthorizeUrl(cfg, { state, codeChallenge, provider, redirectUri })

    stateStore.set(state, { provider, createdAt: Date.now() })
    sendJson(res, 200, { authorizationUrl, state })
    return
  }

  if (req.method === 'POST' && url.pathname === '/api/auth/callback') {
    const body = await readJson(req, res)
    if (!body) return
    const { code, provider, codeVerifier, state } = body
    if (!code || !provider || !codeVerifier) {
      return sendJson(res, 400, { error: 'code, provider, and codeVerifier are required' })
    }
    const cfg = providerConfig[provider]
    if (!cfg || !cfg.clientId || !cfg.clientSecret) {
      return sendJson(res, 400, { error: 'Unsupported provider or missing config' })
    }

    if (stateStore.has(state)) {
      const stored = stateStore.get(state)
      if (stored?.provider !== provider) {
        return sendJson(res, 400, { error: 'State/provider mismatch' })
      }
      stateStore.delete(state)
    }

    try {
      const redirectUri = appendProvider(resolveRedirectBase(req), provider)
      const tokenSet = await exchangeToken(cfg, provider, { code, codeVerifier, redirectUri })
      const profile = await loadProfile(provider, tokenSet)
      const session = {
        provider,
        accessToken: tokenSet.accessToken,
        refreshToken: tokenSet.refreshToken || '',
        user: {
          ...profile,
          provider,
          ...accents[provider],
        },
      }
      sessionStore.set(session.accessToken, session)
      return sendJson(res, 200, {
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
      })
    } catch (error) {
      console.error('Auth callback failed', error)
      return sendJson(res, 500, { error: 'Auth callback failed' })
    }
  }

  if (req.method === 'GET' && url.pathname === '/api/auth/me') {
    const auth = parseBearer(req)
    if (!auth) return sendJson(res, 401, { error: 'Unauthorized' })
    const session = sessionStore.get(auth)
    if (!session) return sendJson(res, 401, { error: 'Invalid token' })
    return sendJson(res, 200, session.user)
  }

  if (req.method === 'POST' && url.pathname === '/api/auth/logout') {
    const auth = parseBearer(req)
    if (auth && sessionStore.has(auth)) {
      sessionStore.delete(auth)
    }
    return sendJson(res, 200, { ok: true })
  }

  sendJson(res, 404, { error: 'Not found' })
})

server.listen(PORT, HOST, () => {
  console.log(`Auth API listening on http://${HOST}:${PORT}`)
})

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload)
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
  })
  res.end(body)
}

async function readJson(req, res) {
  try {
    const chunks = []
    for await (const chunk of req) {
      chunks.push(chunk)
    }
    const raw = Buffer.concat(chunks).toString('utf-8')
    if (!raw) return {}
    return JSON.parse(raw)
  } catch {
    sendJson(res, 400, { error: 'Invalid JSON' })
    return null
  }
}

function parseBearer(req) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) return null
  return header.slice('Bearer '.length)
}

function randomState() {
  return randomBytes(16).toString('hex')
}

function appendProvider(base, provider) {
  const url = new URL(base)
  url.searchParams.set('provider', provider)
  return url.toString()
}

function resolveRedirectBase(req) {
  if (process.env.AUTH_REDIRECT_URL) return process.env.AUTH_REDIRECT_URL
  const forwardedProto = req.headers['x-forwarded-proto']
  const forwardedHost = req.headers['x-forwarded-host']
  const referer = req.headers.referer

  if (forwardedHost) {
    return `${forwardedProto || 'http'}://${forwardedHost}/auth-callback.html`
  }

  if (referer) {
    try {
      const ref = new URL(referer)
      return `${ref.origin}/auth-callback.html`
    } catch {
      // fall through
    }
  }

  const host = req.headers.host || 'localhost:5173'
  return `${forwardedProto || 'http'}://${host}/auth-callback.html`
}

function buildAuthorizeUrl(cfg, { state, codeChallenge, provider, redirectUri }) {
  const url = new URL(cfg.authorizeUrl)
  url.searchParams.set('client_id', cfg.clientId)
  url.searchParams.set('redirect_uri', redirectUri)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('scope', cfg.scope)
  url.searchParams.set('state', state)
  url.searchParams.set('code_challenge', codeChallenge)
  url.searchParams.set('code_challenge_method', 'S256')

  if (provider === 'google') {
    url.searchParams.set('access_type', 'offline')
    url.searchParams.set('prompt', 'consent')
  }
  if (provider === 'apple') {
    url.searchParams.set('response_mode', 'query')
  }
  return url.toString()
}

async function exchangeToken(cfg, provider, { code, codeVerifier, redirectUri }) {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    client_id: cfg.clientId,
    client_secret: cfg.clientSecret,
    redirect_uri: redirectUri,
    code_verifier: codeVerifier,
  })

  const res = await fetch(cfg.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Token exchange failed (${provider}): ${res.status} ${text}`)
  }

  const data = await res.json()
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token || '',
    idToken: data.id_token,
    scope: data.scope,
    tokenType: data.token_type,
    expiresIn: data.expires_in,
  }
}

async function loadProfile(provider, tokenSet) {
  if (provider === 'google') {
    const res = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
      headers: { Authorization: `Bearer ${tokenSet.accessToken}` },
    })
    if (!res.ok) throw new Error('Failed to load Google profile')
    const data = await res.json()
    return {
      id: data.sub,
      name: data.name || data.email,
      email: data.email,
    }
  }

  if (provider === 'github') {
    const userRes = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${tokenSet.accessToken}`, 'User-Agent': 'maranova-app' },
    })
    if (!userRes.ok) throw new Error('Failed to load GitHub profile')
    const user = await userRes.json()

    let email = user.email
    if (!email) {
      try {
        const emailRes = await fetch('https://api.github.com/user/emails', {
          headers: { Authorization: `Bearer ${tokenSet.accessToken}`, 'User-Agent': 'maranova-app' },
        })
        if (emailRes.ok) {
          const emails = await emailRes.json()
          const primary = emails.find((item) => item.primary) || emails[0]
          email = primary?.email
        }
      } catch {
        // ignore
      }
    }

    return {
      id: String(user.id),
      name: user.name || user.login,
      email: email || `${user.login}@users.noreply.github.com`,
    }
  }

  if (provider === 'apple') {
    if (!tokenSet.idToken) {
      throw new Error('Missing Apple id_token')
    }
    const claims = decodeJwt(tokenSet.idToken)
    return {
      id: claims.sub,
      name: claims.email?.split('@')[0] || 'Apple User',
      email: claims.email,
    }
  }

  throw new Error('Unsupported provider')
}

function decodeJwt(token) {
  const parts = token.split('.')
  if (parts.length !== 3) throw new Error('Invalid JWT')
  const payload = parts[1]
  const decoded = Buffer.from(payload.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString(
    'utf-8',
  )
  return JSON.parse(decoded)
}
