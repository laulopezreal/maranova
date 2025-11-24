import { motion } from 'framer-motion'

export type ViewMode = 'grid' | 'list'

type ViewSwitcherProps = {
  currentView: ViewMode
  onViewChange: (view: ViewMode) => void
}

export function ViewSwitcher({ currentView, onViewChange }: ViewSwitcherProps) {
  return (
    <div className="inline-flex items-center gap-0.5 rounded-lg border border-white/10 bg-white/[0.03] p-1 backdrop-blur-sm">
      <button
        onClick={() => onViewChange('grid')}
        className={`relative flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
          currentView === 'grid'
            ? 'text-white'
            : 'text-slate-400 hover:text-slate-300'
        }`}
      >
        {currentView === 'grid' && (
          <motion.div
            layoutId="activeView"
            className="absolute inset-0 rounded-md bg-white/10"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="relative z-10"
        >
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
        <span className="relative z-10">Grid</span>
      </button>

      <button
        onClick={() => onViewChange('list')}
        className={`relative flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
          currentView === 'list'
            ? 'text-white'
            : 'text-slate-400 hover:text-slate-300'
        }`}
      >
        {currentView === 'list' && (
          <motion.div
            layoutId="activeView"
            className="absolute inset-0 rounded-md bg-white/10"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="relative z-10"
        >
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
        <span className="relative z-10">List</span>
      </button>
    </div>
  )
}
