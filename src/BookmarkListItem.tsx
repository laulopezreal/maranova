import { motion } from 'framer-motion'

type BookmarkListItemProps = {
  title: string
  url: string
  favicon?: string
  tags?: string[]
  idleDelay?: number
}

export function BookmarkListItem({
  title,
  url,
  favicon,
  tags,
  idleDelay = 0,
}: BookmarkListItemProps) {
  const hostname = new URL(url).hostname.replace('www.', '')

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
      className="group relative flex items-center gap-4 overflow-hidden rounded-lg border border-white/5 bg-white/[0.02] p-3 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.05] hover:shadow-lg"
    >
      {/* Favicon */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white/5 ring-1 ring-white/10 transition-colors group-hover:bg-white/10">
        {favicon ? (
          <img 
            src={favicon} 
            alt="" 
            className="h-6 w-6 object-cover opacity-80 transition-opacity group-hover:opacity-100" 
          />
        ) : (
          <span className="text-sm font-medium text-slate-400">
            {hostname[0]?.toUpperCase()}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-baseline gap-2">
          <span className="truncate text-sm font-medium text-slate-200 transition-colors group-hover:text-white">
            {title}
          </span>
          <span className="shrink-0 text-[11px] text-slate-500 transition-colors group-hover:text-slate-400">
            {hostname}
          </span>
        </div>

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] font-normal text-slate-400 transition-colors group-hover:bg-white/10 group-hover:text-slate-300"
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
          className="text-slate-500 transition-colors group-hover:text-slate-300"
        >
          <path d="M7 17L17 7M17 7H7M17 7V17" />
        </svg>
      </div>

      {/* Hover ring */}
      <div className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-white/5 transition-colors group-hover:ring-white/10" />
    </motion.a>
  )
}
