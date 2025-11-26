import { type MouseEvent, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useTransform, animate } from 'framer-motion'
import GraphView from './GraphView'
import './App.css'
import { mockBookmarkTree, type BookmarkNode } from './mockData'
import { bookmarksToGraphData } from './utils/bookmarkToGraph'
import { BookmarkCard } from './BookmarkCard'
import { BookmarkListItem } from './BookmarkListItem'
import { GlassNavbar } from './GlassNavbar'
import { StarrySky } from './StarrySky'
import { InfoPage } from './InfoPage'
import { Sidebar } from './Sidebar'
import { Breadcrumbs } from './Breadcrumbs'
import { Typewriter } from './Typewriter'
import { ViewSwitcher, type ViewMode } from './ViewSwitcher'
import { infoSections } from './content'

export type Theme = 'galaxy' | 'ocean'
export type Page = 'home' | 'about' | 'docs' | 'terms'

function getPageFromHash(): Page {
  if (typeof window === 'undefined') return 'home'
  const raw = window.location.hash.replace('#', '').replace('/', '')
  if (raw === 'about' || raw === 'docs' || raw === 'terms') return raw
  return 'home'
}

function findNode(nodes: BookmarkNode[], id: string): BookmarkNode | null {
  for (const node of nodes) {
    if (node.id === id) return node
    if (node.children) {
      const found = findNode(node.children, id)
      if (found) return found
    }
  }
  return null
}

function getPath(nodes: BookmarkNode[], id: string, path: BookmarkNode[] = []): BookmarkNode[] | null {
  for (const node of nodes) {
    if (node.id === id) return [...path, node]
    if (node.children) {
      const found = getPath(node.children, id, [...path, node])
      if (found) return found
    }
  }
  return null
}

function App() {
  const [theme, setTheme] = useState<Theme>('galaxy')
  const [page, setPage] = useState<Page>(() => getPageFromHash())
  const [searchQuery, setSearchQuery] = useState('')
  const [currentFolderId, setCurrentFolderId] = useState<string>('root-1')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [showHero, setShowHero] = useState(true)
  const progress = useMotionValue(0)
  const progressText = useTransform(progress, (v) => `${Math.round(v)}%`)
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const isOcean = theme === 'ocean'
  const backgroundGradient = isOcean
    ? 'linear-gradient(180deg, #dff4ff 0%, #c9e7ff 45%, #e9f7ff 100%)'
    : 'linear-gradient(180deg, #0a0a1f, #0f172a)'
  const heroAccent = isOcean ? 'text-sky-800/80' : 'text-indigo-300/80'
  const heroHeadline = isOcean
    ? 'bg-gradient-to-b from-[#0b2348] to-[#1d4f73]'
    : 'bg-gradient-to-b from-white to-white/60'
  const heroCopy = isOcean ? 'text-slate-700' : 'text-slate-400'
  const ringColor = isOcean ? 'text-sky-900/20' : 'text-white/10'
  const panelSurface = isOcean
    ? 'border-sky-900/15 bg-white/70 shadow-[0_18px_48px_rgba(12,74,110,0.12)] backdrop-blur-xl'
    : 'border-white/5 bg-white/[0.02] backdrop-blur-xl'
  const panelHover = isOcean ? 'hover:border-sky-900/25 hover:bg-white/85' : 'hover:border-white/10 hover:bg-white/[0.05]'
  const sectionHeading = isOcean ? 'text-[#0b2348]' : 'text-white/90'
  const sectionLabel = isOcean ? 'text-sky-800/80' : 'text-indigo-300/70'
  const mutedText = isOcean ? 'text-slate-600' : 'text-slate-500'
  // start progress animation on mount
  useEffect(() => {
    animate(progress, 100, { duration: 7, ease: 'linear' })
  }, [progress])

  useEffect(() => {
    const handleHash = () => setPage(getPageFromHash())
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setShowHero(false), 7000)
    return () => clearTimeout(timer)
  }, [])

  const toggleTheme = () => {
    setTheme((current) => (current === 'galaxy' ? 'ocean' : 'galaxy'))
  }

  const navigate = (next: Page) => {
    const hash = next === 'home' ? '' : `/${next}`
    if (window.location.hash !== `#${hash}`) {
      window.location.hash = hash
    }
    setPage(next)
  }

  const handlePointerMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const relativeX = (event.clientX - rect.left) / rect.width - 0.5
    const relativeY = (event.clientY - rect.top) / rect.height - 0.5
    pointerX.set(relativeX * 40)
    pointerY.set(relativeY * 40)
  }

  const resetPointer = () => {
    pointerX.set(0)
    pointerY.set(0)
  }

  // Convert bookmarks to graph data
  const graphData = useMemo(() => bookmarksToGraphData(mockBookmarkTree), [])

  return (
    <motion.div
      className={`relative min-h-screen overflow-hidden theme-${theme} ${isOcean ? 'text-[#0b2348]' : 'text-white'}`}
      style={{
        background: backgroundGradient
      }}
      initial={false}
      animate={{
        background: backgroundGradient
      }}
      transition={{ duration: 0.9, ease: 'easeInOut' }}
      onMouseMove={handlePointerMove}
      onMouseLeave={resetPointer}
    >
      <StarrySky theme={theme} />

      <div className="relative z-10 flex min-h-screen flex-col">
        <GlassNavbar
          theme={theme}
          onToggleTheme={toggleTheme}
          currentPage={page}
          onNavigate={navigate}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="flex flex-1 justify-center px-6 py-16">
          <div className="flex w-full max-w-5xl flex-col gap-16 text-center">
            {page === 'home' ? (
              <>
                <motion.div
                  className="relative overflow-hidden"
                  initial={{ height: '500px' }}
                  animate={{ height: showHero ? '500px' : '0px' }}
                  transition={{ duration: 1.2, ease: 'easeInOut' }}
                >
                  <AnimatePresence>
                    {showHero && (
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 1.2, ease: 'easeInOut' }}
                      >
                        <div className="space-y-8 text-center">
                          <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className={`text-xs font-medium uppercase tracking-[0.4em] ${heroAccent}`}
                          >
                            Curate. Collect. Connect.
                          </motion.p>
                          <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className={`text-5xl font-semibold leading-tight tracking-tight md:text-7xl ${heroHeadline} bg-clip-text text-transparent`}
                          >
                            <Typewriter text="Bookmarks, reimagined." delay={800} speed={150} />
                          </motion.h1>
                          <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className={`mx-auto max-w-2xl text-lg font-light md:text-xl leading-relaxed ${heroCopy}`}
                          >
                            A calmer command center for every link that matters. Organize,
                            tag, and rediscover your web with ease.
                          </motion.p>

                          <div className="mx-auto mt-8 w-16 h-16 relative">
                            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                              <circle
                                cx="18"
                                cy="18"
                                r="16"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className={ringColor}
                              />
                              <motion.circle
                                cx="18"
                                cy="18"
                                r="16"
                                fill="none"
                                stroke="url(#gradient)"
                                strokeWidth="2"
                                strokeLinecap="round"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 7, ease: 'linear' }}
                                strokeDasharray="100.53"
                                strokeDashoffset="0"
                              />
                              <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                  <stop offset="0%" stopColor="#6366f1" />
                                  <stop offset="100%" stopColor="#60a5fa" />
                                </linearGradient>
                              </defs>
                            </svg>
                            <motion.div className={`absolute inset-0 flex items-center justify-center text-sm font-normal ${isOcean ? 'text-[#0b2348]' : 'text-white'}`} >
                              {progressText}
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                <div className="flex flex-col gap-6 md:flex-row md:items-start">
                  <Sidebar
                    nodes={mockBookmarkTree}
                    currentFolderId={currentFolderId}
                    onSelectFolder={setCurrentFolderId}
                    theme={theme}
                  />

                  <div className="flex-1 space-y-6">
                    <div className={`flex items-center justify-between rounded-xl px-4 py-3 ${panelSurface}`}>
                      <Breadcrumbs
                        path={getPath(mockBookmarkTree, currentFolderId) || []}
                        onSelectFolder={setCurrentFolderId}
                        theme={theme}
                      />
                      <ViewSwitcher currentView={viewMode} onViewChange={setViewMode} />
                    </div>

                    {viewMode === 'graph' ? (
                      <div className={`h-[600px] rounded-xl overflow-hidden ${panelSurface}`}>
                        <GraphView
                          data={graphData}
                          width={1000}
                          height={600}
                          focusNodeId={currentFolderId}
                          onNodeClick={setCurrentFolderId}
                        />
                      </div>
                    ) : (
                    <section className={`rounded-xl p-4 ${panelSurface} ${viewMode === 'grid' ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3' : 'flex flex-col gap-3'}`}>
                      {(() => {
                        const currentFolder = findNode(mockBookmarkTree, currentFolderId)
                        const bookmarks = currentFolder?.children?.filter((c) => c.type === 'bookmark') || []
                        const folders = currentFolder?.children?.filter((c) => c.type === 'folder') || []

                        // If searching, search globally (simplified for MVP: searching current folder structure)
                        // For a real app, you'd likely want a global search index.
                        // Here, let's just filter the current view if there's a query, 
                        // OR we could implement a global search function. 
                        // Let's stick to current folder filtering for now to match the "Explorer" vibe,
                        // or maybe global search is better? 
                        // Let's do: if search query exists, show flat list of ALL matching bookmarks.

                        const displayNodes = [...folders, ...bookmarks]

                        if (searchQuery) {
                          const flatten = (nodes: BookmarkNode[]): BookmarkNode[] => {
                            let acc: BookmarkNode[] = []
                            for (const node of nodes) {
                              if (node.type === 'bookmark') acc.push(node)
                              if (node.children) acc = [...acc, ...flatten(node.children)]
                            }
                            return acc
                          }
                          const allBookmarks = flatten(mockBookmarkTree)
                          const q = searchQuery.toLowerCase()
                          return allBookmarks
                            .filter(b =>
                              b.title.toLowerCase().includes(q) ||
                              b.url?.toLowerCase().includes(q) ||
                              b.tags?.some(t => t.toLowerCase().includes(q))
                            )
                            .map((bookmark, index) => {
                              const Component = viewMode === 'grid' ? BookmarkCard : BookmarkListItem
                              return (
                                <Component
                                  key={bookmark.id}
                                  idleDelay={index * 0.05}
                                  title={bookmark.title}
                                  url={bookmark.url || '#'}
                                  favicon={bookmark.favicon}
                                  tags={bookmark.tags}
                                  theme={theme}
                                />
                              )
                            })
                        }

                        if (displayNodes.length === 0) {
                          return (
                            <div className={`col-span-full py-12 text-center ${mutedText}`}>
                              <p>This folder is empty.</p>
                            </div>
                          )
                        }

                        return displayNodes.map((node, index) => {
                          if (node.type === 'folder') {
                            return (
                              <motion.button
                                key={node.id}
                                onClick={() => setCurrentFolderId(node.id)}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`group flex gap-3 rounded-xl p-4 transition-all ${panelSurface} ${panelHover} ${
                                  viewMode === 'grid' ? 'h-32 flex-col items-center justify-center' : 'items-center'
                                }`}
                              >
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`${isOcean ? 'text-sky-700 group-hover:text-sky-800' : 'text-indigo-300/70 transition-colors group-hover:text-indigo-300'}`}>
                                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                                </svg>
                                <span className={`text-sm font-medium transition-colors ${isOcean ? 'text-[#0b2348] group-hover:text-sky-900' : 'text-slate-300 group-hover:text-white'}`}>{node.title}</span>
                              </motion.button>
                            )
                          }
                          const Component = viewMode === 'grid' ? BookmarkCard : BookmarkListItem
                          return (
                            <Component
                              key={node.id}
                              idleDelay={index * 0.05}
                              title={node.title}
                              url={node.url || '#'}
                              favicon={node.favicon}
                              tags={node.tags}
                              theme={theme}
                            />
                          )
                        })
                      })()}
                    </section>
                    )}
                  </div>
                </div>

                <section className={`rounded-3xl px-8 py-12 text-left ${panelSurface}`}>
                  <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                      <p className={`text-xs font-medium uppercase tracking-[0.3em] ${sectionLabel}`}>
                        Orbit notes
                      </p>
                      <h2 className={`mt-2 text-3xl font-bold tracking-tight ${sectionHeading}`}>About, Docs, Terms</h2>
                    </div>
                    <span className={`text-xs max-w-xs text-right hidden md:block ${mutedText}`}>
                      Maranova = mare (sea) + nova (new star).<br />Two moods, one calm surface.
                    </span>
                  </div>

                  <div className="mt-10 grid gap-6 md:grid-cols-3">
                    {infoSections.map((section, index) => {
                      const bloom =
                        theme === 'galaxy'
                          ? 'radial-gradient(circle at 20% 20%, rgba(129, 140, 248, 0.08), transparent 50%)'
                          : 'radial-gradient(circle at 80% 20%, rgba(34, 211, 238, 0.08), transparent 50%)'

                      return (
                        <motion.article
                          id={section.id}
                          key={section.id}
                          className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 ${panelSurface} ${panelHover}`}
                          style={{ backgroundImage: bloom }}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.08 + 0.2, duration: 0.6, ease: 'easeOut' }}
                          whileHover={{
                            y: -4,
                          }}
                        >
                          <div className={`pointer-events-none absolute -right-10 top-0 h-32 w-32 rounded-full blur-3xl transition-opacity duration-500 ${isOcean ? 'bg-sky-200/40 group-hover:bg-sky-200/60' : 'bg-white/5 group-hover:bg-white/10'}`} />
                          <div className="flex items-center justify-between gap-2">
                            <h3 className={`text-lg font-semibold ${sectionHeading}`}>{section.title}</h3>
                            <span className={`rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-wider ${
                              isOcean
                                ? 'border border-sky-900/15 bg-white/80 text-slate-700'
                                : 'border border-white/10 bg-white/5 text-white/50'
                            }`}>
                              {section.id.toUpperCase()}
                            </span>
                          </div>
                          <p className={`mt-4 text-sm leading-relaxed ${isOcean ? 'text-slate-700' : 'text-slate-400'}`}>{section.blurb}</p>
                          <ul className={`mt-6 space-y-2.5 text-sm ${isOcean ? 'text-slate-700' : 'text-slate-400'}`}>
                            {section.highlights.map((item) => (
                              <li
                                key={item}
                                className="flex items-center gap-3"
                              >
                                <span className={`h-1 w-1 rounded-full ${isOcean ? 'bg-sky-600/60' : 'bg-indigo-400/70'}`} />
                                <span className="leading-snug">{item}</span>
                              </li>
                            ))}
                          </ul>
                          <div className={`mt-6 flex items-center justify-between text-xs ${isOcean ? 'text-slate-600' : 'text-slate-400'}`}>
                            <span>Learn more</span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${isOcean ? 'text-slate-600 group-hover:text-sky-900' : 'text-slate-400 group-hover:text-white'}`}>
                              <path d="M7 17L17 7M17 7H7M17 7V17" />
                            </svg>
                          </div>
                          <motion.a
                            href={`#/${section.id}`}
                            onClick={(event) => {
                              event.preventDefault()
                              navigate(section.id as Page)
                            }}
                            className={`mt-6 inline-flex items-center gap-2 text-sm font-medium transition-colors ${isOcean ? 'text-sky-900 hover:text-sky-800' : 'text-indigo-300 hover:text-indigo-200'}`}
                          >
                            Read more
                            <span className={isOcean ? 'text-sky-700/60' : 'text-indigo-300/50'}>→</span>
                          </motion.a>
                        </motion.article>
                      )
                    })}
                  </div>
                </section>
              </>
            ) : (
              <InfoPage page={page} theme={theme} onNavigateHome={() => navigate('home')} />
            )}
          </div>
        </main>
      </div>
    </motion.div>
  )
}

export default App
