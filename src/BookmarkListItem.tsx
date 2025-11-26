import { motion } from 'framer-motion'

type BookmarkListItemProps = {
  title: string
  url: string
  favicon?: string
  tags?: string[]
  idleDelay?: number
  theme?: 'galaxy' | 'ocean'
}

export function BookmarkListItem({
  title,
  url,
  favicon,
  tags,
  idleDelay = 0,
  theme = 'galaxy',
}: BookmarkListItemProps) {
  const hostname = new URL(url).hostname.replace('www.', '')
  const isOcean = theme === 'ocean'

  const surface = isOcean
    ? 'border-sky-900/15 bg-white/75 shadow-[0_12px_36px_rgba(12,74,110,0.12)] backdrop-blur-xl'
    : 'border-white/5 bg-white/[0.02]'
  const surfaceHover = isOcean
    ? 'hover:border-sky-900/25 hover:bg-white/90'
    : 'hover:border-white/10 hover:bg-white/[0.05]'
  const titleColor = isOcean ? 'text-[#0b2348]' : 'text-slate-200'
  const titleHover = isOcean ? 'group-hover:text-sky-900' : 'group-hover:text-white'
  const metaColor = isOcean ? 'text-slate-600' : 'text-slate-500'
  const metaHover = isOcean ? 'group-hover:text-slate-700' : 'group-hover:text-slate-400'
  const tagColors = isOcean
    ? 'bg-sky-100/80 text-sky-900/80 border border-sky-900/10'
    : 'bg-white/5 text-slate-400'

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: idleDelay }}
      whileHover={{
        x: 4,
        transition: { type: 'spring', stiffness: 300, damping: 20 },
      }}
      whileTap={{ scale: 0.99 }}
      className={`group relative flex items-center gap-4 overflow-hidden rounded-lg p-3 transition-all duration-300 ${surface} ${surfaceHover} ${
        isOcean ? 'text-[#0b2348]' : 'text-white'
      }`}
    >
      {/* Favicon */}
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg ring-1 transition-colors ${
          isOcean
            ? 'bg-white/80 ring-sky-900/10 group-hover:bg-white'
            : 'bg-white/5 ring-white/10 group-hover:bg-white/10'
        }`}
      >
        {favicon ? (
          <img
            src={favicon}
            alt=""
            className="h-6 w-6 object-cover opacity-80 transition-opacity group-hover:opacity-100"
          />
        ) : (
          <span className={`text-sm font-medium ${isOcean ? 'text-slate-500' : 'text-slate-400'}`}>
            {hostname[0]?.toUpperCase()}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-baseline gap-2">
          <span className={`truncate text-sm font-medium transition-colors ${titleColor} ${titleHover}`}>
            {title}
          </span>
          <span className={`shrink-0 text-[11px] transition-colors ${metaColor} ${metaHover}`}>
            {hostname}
          </span>
        </div>

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className={`rounded px-1.5 py-0.5 text-[10px] font-normal transition-colors ${tagColors} ${
                  isOcean ? 'group-hover:bg-sky-50 group-hover:text-sky-800' : 'group-hover:bg-white/10 group-hover:text-slate-300'
                }`}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* External link icon */}
      <div className="shrink-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`${isOcean ? 'text-slate-500 group-hover:text-slate-700' : 'text-slate-500 group-hover:text-slate-300'}`}
        >
          <path d="M7 17L17 7M17 7H7M17 7V17" />
        </svg>
      </div>

      {/* Hover ring */}
      <div
        className={`pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset transition-colors ${
          isOcean ? 'ring-sky-900/10 group-hover:ring-sky-900/20' : 'ring-white/5 group-hover:ring-white/10'
        }`}
      />
    </motion.a>
  )
}
