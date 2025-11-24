import { motion } from 'framer-motion'

type BookmarkCardProps = {
  title: string
  url: string
  favicon?: string
  tags?: string[]
  idleDelay?: number
}

export function BookmarkCard({
  title,
  url,
  favicon,
  tags,
  idleDelay = 0,
}: BookmarkCardProps) {
  const hostname = new URL(url).hostname.replace('www.', '')

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: idleDelay }}
      whileHover={{
        y: -4,
        transition: { type: 'spring', stiffness: 300, damping: 20 },
      }}
      whileTap={{ scale: 0.98 }}
      className="group relative flex flex-col gap-3 overflow-hidden rounded-xl border border-white/5 bg-white/[0.03] p-5 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.06] hover:shadow-xl"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-white/5 ring-1 ring-white/10 transition-colors group-hover:bg-white/10">
            {favicon ? (
              <img src={favicon} alt="" className="h-5 w-5 object-cover opacity-80 transition-opacity group-hover:opacity-100" />
            ) : (
              <span className="text-xs font-medium text-slate-400">
                {hostname[0]?.toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-normal text-slate-500 transition-colors group-hover:text-slate-400">{hostname}</span>
            <div className="text-sm font-normal leading-snug text-slate-200 line-clamp-1 group-hover:text-white">{title}</div>
          </div>
        </div>

        <div className="opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 hover:text-white">
            <path d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
        </div>
      </div>

      {tags && tags.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-normal text-slate-400 transition-colors group-hover:bg-white/10 group-hover:text-slate-300"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/5 transition-colors group-hover:ring-white/10 pointer-events-none" />
    </motion.a>
  )
}
