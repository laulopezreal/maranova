import { motion } from 'framer-motion'
import { useState } from 'react'
import { useAuth } from './auth/AuthContext'

type NavPage = 'home' | 'about' | 'docs' | 'terms'

type GlassNavbarProps = {
  theme: 'galaxy' | 'ocean'
  currentPage: NavPage
  onToggleTheme: () => void
  onNavigate: (page: NavPage) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function GlassNavbar({
  theme,
  currentPage,
  onToggleTheme,
  onNavigate,
  searchQuery,
  onSearchChange,
}: GlassNavbarProps) {
  const { user, status, login, logout } = useAuth()
  const [isBusyProvider, setIsBusyProvider] = useState<string | null>(null)

  const providers = [
    { id: 'google', label: 'Google', accent: 'hover:bg-amber-400/20 hover:text-amber-200' },
    { id: 'github', label: 'GitHub', accent: 'hover:bg-emerald-400/20 hover:text-emerald-200' },
    { id: 'apple', label: 'Apple', accent: 'hover:bg-white/20 hover:text-white' },
  ] as const

  const handleLogin = async (provider: (typeof providers)[number]['id']) => {
    setIsBusyProvider(provider)
    await login(provider)
    setIsBusyProvider(null)
  }

  return (
    <motion.header
      className="relative z-20 flex justify-center px-6 pt-8"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      <motion.nav
        className="group relative flex w-full max-w-5xl flex-wrap items-center gap-4 overflow-hidden rounded-full border border-white/5 bg-white/[0.03] px-6 py-3 shadow-lg backdrop-blur-xl transition-all duration-500 hover:bg-white/[0.05] hover:shadow-2xl hover:border-white/10"
      >
        <div className="flex items-center gap-3 whitespace-nowrap text-sm font-semibold tracking-wide">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-300">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </span>
          <span className="text-white/90 font-medium tracking-tight">Maranova</span>
        </div>

        <div className="hidden items-center gap-1 sm:flex ml-4">
          {[
            { label: 'Home', page: 'home' },
            { label: 'About', page: 'about' },
            { label: 'Docs', page: 'docs' },
            { label: 'Terms', page: 'terms' },
          ].map((item) => {
            const active = currentPage === item.page
            return (
              <a
                key={item.page}
                href={item.page === 'home' ? '#/' : `#/${item.page}`}
                onClick={(event) => {
                  event.preventDefault()
                  onNavigate(item.page as NavPage)
                }}
                className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-all duration-300 ${active
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white/90'
                  }`}
              >
                {item.label}
              </a>
            )
          })}
        </div>

        <div className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-3">
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-48 rounded-full border border-white/5 bg-white/5 px-4 py-1.5 text-[13px] text-white placeholder-slate-500 outline-none transition-all focus:w-64 focus:border-white/10 focus:bg-white/10"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-slate-500">
              ⌘K
            </span>
          </div>

          <div className="h-4 w-px bg-white/10 mx-1 hidden sm:block" />

          <div className="flex flex-wrap items-center gap-2">
            {user ? (
              <div className="flex items-center gap-3 pl-2">
                <div className="flex items-center gap-2">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white shadow-inner"
                    style={{ background: user.avatarColor }}
                  >
                    {user.name[0]}
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-[10px] uppercase tracking-wider text-slate-500">
                      {user.provider}
                    </p>
                    <p className="text-xs font-medium text-white/90">{user.name}</p>
                  </div>
                </div>
                <motion.button
                  onClick={logout}
                  className="rounded-full border border-white/10 px-3 py-1.5 text-[11px] font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
                  whileTap={{ scale: 0.96 }}
                >
                  Log out
                </motion.button>
              </div>
            ) : (
              <>
                {providers.map((provider) => (
                  <motion.button
                    key={provider.id}
                    onClick={() => handleLogin(provider.id)}
                    className={`rounded-full border border-white/5 bg-white/5 px-4 py-1.5 text-[12px] font-medium text-slate-300 transition-all hover:border-white/10 ${provider.accent}`}
                    disabled={status === 'authenticating'}
                    type="button"
                    whileTap={{ scale: 0.96 }}
                  >
                    {isBusyProvider === provider.id ? '...' : provider.label}
                  </motion.button>
                ))}
              </>
            )}
          </div>

          <motion.button
            onClick={onToggleTheme}
            className="ml-2 flex h-8 w-8 items-center justify-center rounded-full border border-white/5 bg-white/5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
            type="button"
            whileTap={{ scale: 0.9 }}
          >
            {theme === 'galaxy' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
            )}
          </motion.button>
        </div>
      </motion.nav>
    </motion.header>
  )
}
