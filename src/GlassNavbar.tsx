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

  const isOcean = theme === 'ocean'
  const shellColors = isOcean
    ? 'border-sky-900/15 bg-white/70 text-[#0b2348] shadow-[0_18px_50px_rgba(12,74,110,0.14)] hover:bg-white/80 hover:border-sky-900/25'
    : 'border-white/5 bg-white/[0.03] text-white shadow-lg hover:bg-white/[0.05] hover:border-white/10'
  const navAccent = isOcean ? 'text-sky-900' : 'text-white/90'
  const mutedText = isOcean ? 'text-slate-600' : 'text-slate-400'
  const inputSurface = isOcean
    ? 'border-sky-900/15 bg-white/80 text-[#0b2348] placeholder-slate-500 focus:border-sky-900/25 focus:bg-white'
    : 'border-white/5 bg-white/5 text-white placeholder-slate-500 focus:border-white/10 focus:bg-white/10'
  const controlBorder = isOcean ? 'border-sky-900/15 bg-white/80 hover:border-sky-900/25' : 'border-white/5 bg-white/5 hover:border-white/10'
  const dividerColor = isOcean ? 'bg-sky-900/10' : 'bg-white/10'
  const iconColor = isOcean ? 'text-[#0b2348]' : 'text-white'
  const chipBase = isOcean ? 'text-[#0b2348]' : 'text-white'
  const linkHover = isOcean ? 'hover:bg-sky-100/60 hover:text-sky-900' : 'hover:bg-white/5 hover:text-white/90'

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
        className={`group relative flex w-full max-w-5xl flex-wrap items-center gap-4 overflow-hidden rounded-full px-6 py-3 backdrop-blur-xl transition-all duration-500 hover:shadow-2xl ${shellColors}`}
      >
        <div className="flex items-center gap-3 whitespace-nowrap text-sm font-semibold tracking-wide">
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-full ${
              isOcean ? 'bg-sky-900/10 text-sky-800' : 'bg-indigo-500/10 text-indigo-300'
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </span>
          <span className={`${navAccent} font-medium tracking-tight`}>Maranova</span>
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
                  ? isOcean
                    ? 'bg-sky-100/80 text-sky-900 shadow-sm'
                    : 'bg-white/10 text-white shadow-sm'
                  : `${mutedText} ${linkHover}`
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
              className={`w-48 rounded-full px-4 py-1.5 text-[13px] outline-none transition-all focus:w-64 ${inputSurface}`}
            />
            <span className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium ${mutedText}`}>
              ⌘K
            </span>
          </div>

          <div className={`h-4 w-px mx-1 hidden sm:block ${dividerColor}`} />

          <div className="flex flex-wrap items-center gap-2">
            {user ? (
              <div className="flex items-center gap-3 pl-2">
                <div className="flex items-center gap-2">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold shadow-inner ${chipBase}`}
                    style={{ background: user.avatarColor }}>
                    {user.name[0]}
                  </div>
                  <div className="hidden lg:block">
                    <p className={`text-[10px] uppercase tracking-wider ${mutedText}`}>
                      {user.provider}
                    </p>
                    <p className={`text-xs font-medium ${navAccent}`}>{user.name}</p>
                  </div>
                </div>
                <motion.button
                  onClick={logout}
                  className={`rounded-full px-3 py-1.5 text-[11px] font-medium transition ${controlBorder} ${isOcean ? 'text-slate-700 hover:bg-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
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
                    className={`rounded-full px-4 py-1.5 text-[12px] font-medium transition-all ${
                      isOcean
                        ? 'border-sky-900/15 bg-white/80 text-slate-700 hover:border-sky-900/25 hover:bg-white'
                        : `border border-white/5 bg-white/5 text-slate-300 hover:border-white/10 ${provider.accent}`
                    }`}
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
            className={`ml-2 flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
              isOcean
                ? 'border-sky-900/15 bg-white/80 text-slate-700 hover:border-sky-900/25 hover:bg-white'
                : 'border border-white/5 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
            }`}
            type="button"
            whileTap={{ scale: 0.9 }}
          >
            {theme === 'galaxy' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={iconColor}><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={iconColor}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
            )}
          </motion.button>
        </div>
      </motion.nav>
    </motion.header>
  )
}
