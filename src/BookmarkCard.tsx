import { motion } from 'framer-motion'
import { type Theme } from './App'

type BookmarkCardProps = {
  title: string
  url: string
  favicon?: string
  tags?: string[]
  idleDelay?: number
  onTagClick?: (tag: string) => void
  theme?: Theme
}

export function BookmarkCard({
  title,
  url,
  favicon,
  tags,
  idleDelay = 0,
  onTagClick,
  theme = 'galaxy',
}: BookmarkCardProps) {
  const hostname = new URL(url).hostname.replace('www.', '')
  const isOcean = theme === 'ocean'

  const surface = isOcean
    ? 'border-sky-900/15 bg-white/75 shadow-[0_18px_48px_rgba(12,74,110,0.15)] backdrop-blur-xl'
    : 'border-white/5 bg-white/[0.03]'
  const surfaceHover = isOcean
    ? 'hover:border-sky-900/25 hover:bg-white/90'
    : 'hover:border-white/10 hover:bg-white/[0.06]'
  const titleColor = isOcean ? 'text-[#0b2348]' : 'text-slate-200'
  const titleHover = isOcean ? 'group-hover:text-sky-900' : 'group-hover:text-white'
  const metaColor = isOcean ? 'text-slate-600' : 'text-slate-500'
  const metaHover = isOcean ? 'group-hover:text-slate-700' : 'group-hover:text-slate-400'

  // Tag styles based on theme
  const tagBase = isOcean
    ? 'bg-sky-100/80 text-sky-900/80 border border-sky-900/10'
    : 'bg-white/5 text-slate-400'

  const tagHover = isOcean
    ? 'hover:bg-sky-200 hover:text-sky-900 hover:scale-105 group-hover:bg-sky-50 group-hover:text-sky-800'
    : 'hover:bg-indigo-500/20 hover:text-indigo-300 hover:scale-105 group-hover:bg-white/10 group-hover:text-slate-300'

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: idleDelay }}
      whileHover={{
        y: -4,
        transition: { type: 'spring', stiffness: 300, damping: 20 },
      }}
      whileTap={{ scale: 0.98 }}
      className={`group relative flex h-32 flex-col justify-between rounded-xl border p-4 transition-all duration-300 hover:shadow-2xl ${surface} ${surfaceHover}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span className={`truncate text-sm font-medium transition-colors ${titleColor} ${titleHover}`}>
            {title}
          </span>
          <span className={`truncate text-[11px] transition-colors ${metaColor} ${metaHover}`}>
            {hostname}
          </span>
        </div>
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${isOcean ? 'bg-sky-100/50 group-hover:bg-sky-100' : 'bg-white/5 group-hover:bg-white/10'}`}>
          {favicon ? (
            <img
              src={favicon}
              alt=""
              className="h-4 w-4 object-cover opacity-80 transition-opacity group-hover:opacity-100"
            />
          ) : (
            <span className={`text-xs font-medium ${isOcean ? 'text-sky-900/60' : 'text-slate-400'}`}>
              {hostname[0]?.toUpperCase()}
            </span>
          )}
        </div>
      </div>

      {tags && tags.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onTagClick?.(tag)
              }}
              className={`cursor-pointer rounded-md px-2 py-0.5 text-[10px] font-normal transition-all ${tagBase} ${tagHover}`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      <div className={`absolute inset-0 rounded-xl ring-1 ring-inset transition-colors pointer-events-none ${isOcean ? 'ring-sky-900/5 group-hover:ring-sky-900/10' : 'ring-white/5 group-hover:ring-white/10'}`} />
    </motion.a>
  )
}
