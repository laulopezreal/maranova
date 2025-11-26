import { motion } from 'framer-motion'

type BookmarkCardProps = {
  title: string
  url: string
  favicon?: string
  tags?: string[]
  idleDelay?: number
  theme?: 'galaxy' | 'ocean'
}

export function BookmarkCard({
  title,
  url,
  favicon,
  tags,
  idleDelay = 0,
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
  const tagColors = isOcean
    ? 'bg-sky-100/80 text-sky-900/80 border border-sky-900/10'
    : 'bg-white/5 text-slate-400'

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: idleDelay }}
      whileHover={{
        y: -4,
        transition: { type: 'spring', stiffness: 300, damping: 20 },
      }}
      whileTap={{ scale: 0.98 }}
      className={`group relative flex flex-col gap-3 overflow-hidden rounded-xl p-5 transition-all duration-300 ${surface} ${surfaceHover} ${
        isOcean ? 'text-[#0b2348]' : 'text-white'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg ring-1 transition-colors ${
              isOcean
                ? 'bg-white/80 ring-sky-900/10 group-hover:bg-white'
                : 'bg-white/5 ring-white/10 group-hover:bg-white/10'
            }`}
          >
            {favicon ? (
              <img src={favicon} alt="" className="h-5 w-5 object-cover opacity-80 transition-opacity group-hover:opacity-100" />
            ) : (
              <span className={`text-xs font-medium ${isOcean ? 'text-slate-500' : 'text-slate-400'}`}>
                {hostname[0]?.toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <span className={`text-[11px] font-normal transition-colors ${metaColor} ${metaHover}`}>{hostname}</span>
            <div className={`text-sm font-normal leading-snug line-clamp-1 ${titleColor} ${titleHover}`}>{title}</div>
          </div>
        </div>

        <div className="opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`${isOcean ? 'text-slate-500 hover:text-slate-700' : 'text-slate-500 hover:text-white'}`}
          >
            <path d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
        </div>
      </div>

      {tags && tags.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className={`rounded-md px-2 py-0.5 text-[10px] font-normal transition-colors ${tagColors} ${
                isOcean ? 'group-hover:bg-sky-50 group-hover:text-sky-800' : 'group-hover:bg-white/10 group-hover:text-slate-300'
              }`}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div
        className={`pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset transition-colors ${
          isOcean ? 'ring-sky-900/10 group-hover:ring-sky-900/20' : 'ring-white/5 group-hover:ring-white/10'
        }`}
      />
    </motion.a>
  )
}
