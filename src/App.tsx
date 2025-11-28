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
import { MobileSidebar } from './MobileSidebar'
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
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const progress = useMotionValue(0)
  const progressText = useTransform(progress, (v) => `${Math.round(v)}%`)
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)

  // Function to skip/dismiss hero
  const skipHero = () => {
    setShowHero(false)
  }

  // start progress animation on mount
  useEffect(() => {
    animate(progress, 100, { duration: 7, ease: 'linear' })
  }, [progress])

  useEffect(() => {
    const handleHash = () => setPage(getPageFromHash())
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])

  // Auto-dismiss hero after 7 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowHero(false), 7000)
    return () => clearTimeout(timer)
  }, [])

  // Dismiss hero on scroll
  useEffect(() => {
    if (!showHero) return

    const handleScroll = () => {
      if (window.scrollY > 50) {
        skipHero()
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [showHero])

  // ⌘K / Ctrl+K keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        const searchInput = document.querySelector('input[type="text"][placeholder="Search..."]') as HTMLInputElement
        if (searchInput) {
          searchInput.focus()
          searchInput.select()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
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
      className={`relative min-h-screen overflow-hidden ${theme === 'galaxy' ? 'text-white' : 'text-gray-900'}`}
      style={{
        background: theme === 'galaxy'
          ? 'linear-gradient(180deg, #0a0a1f, #0f172a)'
          : 'linear-gradient(180deg, #f8f9fa, #e8eef2)'
      }}
      initial={false}
      animate={{
        background: theme === 'galaxy'
          ? 'linear-gradient(180deg, #0a0a1f, #0f172a)'
          : 'linear-gradient(180deg, #f8f9fa, #e8eef2)'
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
                  className="relative overflow-hidden cursor-pointer"
                  initial={{ height: '500px' }}
                  animate={{ height: showHero ? '500px' : '0px' }}
                  transition={{ duration: 1.2, ease: 'easeInOut' }}
                  onClick={skipHero}
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
                        <div className="space-y-8 text-center relative">
                          {/* Skip Button */}
                          <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 0.5 }}
                            onClick={skipHero}
                            className="absolute -top-4 right-0 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-400 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
                          >
                            Skip
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M13 17l5-5-5-5M6 17l5-5-5-5" />
                            </svg>
                          </motion.button>

                          <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-xs font-medium uppercase tracking-[0.4em] text-indigo-300/80"
                          >
                            Curate. Collect. Connect.
                          </motion.p>
                          <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="text-5xl font-semibold leading-tight tracking-tight md:text-7xl bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent"
                          >
                            <Typewriter text="Bookmarks, reimagined." delay={800} speed={150} />
                          </motion.h1>
                          <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="mx-auto max-w-2xl text-lg font-light text-slate-400 md:text-xl leading-relaxed"
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
                                className="text-white/10"
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
                            <motion.div className="absolute inset-0 flex items-center justify-center text-sm font-normal text-white" >
                              {progressText}
                            </motion.div>
                          </div>

                          {/* Hint text */}
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 2, duration: 0.5 }}
                            className="text-xs text-slate-500 mt-4"
                          >
                            Click anywhere or scroll to continue
                          </motion.p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                <div className="flex flex-col gap-6 md:flex-row md:items-start">
                  {/* Mobile Sidebar Drawer */}
                  <MobileSidebar
                    nodes={mockBookmarkTree}
                    currentFolderId={currentFolderId}
                    onSelectFolder={setCurrentFolderId}
                    isOpen={isMobileSidebarOpen}
                    onClose={() => setIsMobileSidebarOpen(false)}
                  />

                  {/* Desktop Sidebar */}
                  <Sidebar
                    nodes={mockBookmarkTree}
                    currentFolderId={currentFolderId}
                    onSelectFolder={setCurrentFolderId}
                  />

                  <div className="flex-1 space-y-6">
                    <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        {/* Hamburger Menu Button (Mobile Only) */}
                        <button
                          onClick={() => setIsMobileSidebarOpen(true)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/5 hover:text-white md:hidden"
                          aria-label="Open menu"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                          </svg>
                        </button>
                        <Breadcrumbs
                          path={getPath(mockBookmarkTree, currentFolderId) || []}
                          onSelectFolder={setCurrentFolderId}
                        />
                      </div>
                      <ViewSwitcher currentView={viewMode} onViewChange={setViewMode} />
                    </div>

                    {viewMode === 'graph' ? (
                      <div className="h-[600px] rounded-xl overflow-hidden border border-white/5 bg-white/[0.02] backdrop-blur-xl">
                        <GraphView
                          data={graphData}
                          width={1000}
                          height={600}
                          focusNodeId={currentFolderId}
                          onNodeClick={setCurrentFolderId}
                        />
                      </div>
                    ) : (
                      <section className={`backdrop-blur-xl rounded-xl border border-white/5 bg-white/[0.02] p-4 ${viewMode === 'grid' ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3' : 'flex flex-col gap-3'}`}>
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
                            const searchResults = allBookmarks
                              .filter(b =>
                                b.title.toLowerCase().includes(q) ||
                                b.url?.toLowerCase().includes(q) ||
                                b.tags?.some(t => t.toLowerCase().includes(q))
                              )

                            if (searchResults.length === 0) {
                              return (
                                <div className="col-span-full py-16 text-center">
                                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-slate-600">
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="m21 21-4.35-4.35" />
                                  </svg>
                                  <p className="text-slate-400 text-sm">No bookmarks found for "{searchQuery}"</p>
                                  <p className="text-slate-600 text-xs mt-2">Try a different search term</p>
                                </div>
                              )
                            }

                            return (
                              <>
                                <div className="col-span-full mb-2 flex items-center gap-2 text-xs text-slate-400">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="m21 21-4.35-4.35" />
                                  </svg>
                                  Found {searchResults.length} bookmark{searchResults.length !== 1 ? 's' : ''}
                                </div>
                                {searchResults.map((bookmark, index) => {
                                  const Component = viewMode === 'grid' ? BookmarkCard : BookmarkListItem
                                  return (
                                    <Component
                                      key={bookmark.id}
                                      idleDelay={index * 0.05}
                                      title={bookmark.title}
                                      url={bookmark.url || '#'}
                                      favicon={bookmark.favicon}
                                      tags={bookmark.tags}
                                      onTagClick={setSearchQuery}
                                    />
                                  )
                                })}
                              </>
                            )
                          }

                          if (displayNodes.length === 0) {
                            return (
                              <div className="col-span-full py-16 text-center">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-slate-600">
                                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                                </svg>
                                <p className="text-slate-400 text-base font-medium mb-2">This folder is empty</p>
                                <p className="text-slate-600 text-sm">No bookmarks or subfolders here yet</p>
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
                                  className={`group flex gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-all hover:border-white/10 hover:bg-white/[0.05] ${viewMode === 'grid' ? 'h-32 flex-col items-center justify-center' : 'items-center'
                                    }`}
                                >
                                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-300/70 transition-colors group-hover:text-indigo-300">
                                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                                  </svg>
                                  <span className="text-sm font-medium text-slate-300 group-hover:text-white">{node.title}</span>
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
                                onTagClick={setSearchQuery}
                              />
                            )
                          })
                        })()}
                      </section>
                    )}
                  </div>
                </div>

                <section className="rounded-3xl border border-white/5 bg-white/[0.02] px-8 py-12 text-left shadow-2xl backdrop-blur-xl">
                  <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.3em] text-indigo-300/70">
                        Orbit notes
                      </p>
                      <h2 className="mt-2 text-3xl font-bold tracking-tight text-white/90">About, Docs, Terms</h2>
                    </div>
                    <span className="text-xs text-slate-500 max-w-xs text-right hidden md:block">
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
                          className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03] p-6 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.06] hover:shadow-xl"
                          style={{ backgroundImage: bloom }}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.08 + 0.2, duration: 0.6, ease: 'easeOut' }}
                          whileHover={{
                            y: -4,
                          }}
                        >
                          <div className="pointer-events-none absolute -right-10 top-0 h-32 w-32 rounded-full bg-white/5 blur-3xl transition-opacity duration-500 group-hover:bg-white/10" />
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="text-lg font-semibold text-white/90">{section.title}</h3>
                            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-white/50">
                              {section.id}
                            </span>
                          </div>
                          <p className="mt-4 text-sm leading-relaxed text-slate-400">{section.blurb}</p>
                          <ul className="mt-6 space-y-2.5 text-sm text-slate-400">
                            {section.highlights.map((item) => (
                              <li
                                key={item}
                                className="flex items-center gap-3"
                              >
                                <span className="h-1 w-1 rounded-full bg-indigo-400/70" />
                                <span className="leading-snug">{item}</span>
                              </li>
                            ))}
                          </ul>
                          <motion.a
                            href={`#/${section.id}`}
                            onClick={(event) => {
                              event.preventDefault()
                              navigate(section.id as Page)
                            }}
                            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-indigo-300 transition-colors hover:text-indigo-200"
                          >
                            Read more
                            <span className="text-indigo-300/50">→</span>
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
