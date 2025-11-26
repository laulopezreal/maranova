import { motion } from 'framer-motion'
import { type Page, type Theme } from './App'
import { pageContent } from './content'

type InfoPageProps = {
    page: Exclude<Page, 'home'> | Page
    theme: Theme
    onNavigateHome: () => void
}

export function InfoPage({
    page,
    theme,
    onNavigateHome,
}: InfoPageProps) {
    if (page === 'home') return null
    const content = pageContent[page as Exclude<Page, 'home'>]
    const isOcean = theme === 'ocean'
    const bloom =
        theme === 'galaxy'
            ? 'radial-gradient(circle at 20% 20%, rgba(129, 140, 248, 0.18), transparent 50%), radial-gradient(circle at 70% 80%, rgba(59, 130, 246, 0.15), transparent 60%)'
            : 'radial-gradient(circle at 80% 20%, rgba(34, 211, 238, 0.16), transparent 50%), radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.18), transparent 60%)'
    const cardSurface = isOcean
        ? 'border-sky-900/15 bg-white/75 shadow-[0_18px_50px_rgba(12,74,110,0.14)]'
        : 'border-white/10 bg-white/5 shadow-[0_15px_45px_rgba(0,0,0,0.25)]'
    const cardOutline = isOcean ? 'outline outline-1 outline-sky-900/10' : 'outline outline-1 outline-indigo-100/10'
    const textColor = isOcean ? 'text-[#0b2348]' : 'text-white'
    const subText = isOcean ? 'text-slate-600' : 'text-white/80'

    return (
        <section className="mx-auto flex w-full max-w-6xl flex-col items-center px-6 pb-16 text-center md:px-10">
            <p className={`text-xs uppercase tracking-[0.45em] ${subText}`}>{page}</p>
            <h1 className={`mt-3 text-4xl font-semibold leading-tight md:text-5xl ${textColor}`}>{content.heading}</h1>
            <p className={`mt-5 max-w-3xl text-base md:text-lg ${subText}`}>{content.subheading}</p>

            <div className="mt-12 grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {content.blocks.map((block) => (
                    <motion.article
                        key={block.title}
                        className={`relative h-full w-full overflow-hidden rounded-2xl border p-5 text-left backdrop-blur-md ${cardSurface} ${cardOutline}`}
                        style={{ backgroundImage: bloom }}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                        <div className="pointer-events-none absolute -right-10 top-0 h-24 w-24 rounded-full bg-white/10 blur-3xl" />
                        <h3 className={`text-xl font-semibold ${textColor}`}>{block.title}</h3>
                        <p className={`mt-2 text-sm ${subText}`}>{block.body}</p>
                    </motion.article>
                ))}
            </div>

            <div className="mt-8 inline-flex flex-wrap items-center gap-3">
                <motion.button
                    onClick={onNavigateHome}
                    className={`rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] transition ${
                        isOcean
                            ? 'border-sky-900/20 bg-white/80 text-[#0b2348] hover:border-sky-900/30 hover:bg-white'
                            : 'border-white/30 bg-white/10 text-white hover:border-white/50 hover:bg-white/15'
                    }`}
                    whileTap={{ scale: 0.95 }}
                >
                    ← Back to home
                </motion.button>
                <span className={`text-xs ${subText}`}>
                    Maranova = mare (sea) + nova (new star). Two moods, one calm surface.
                </span>
            </div>
        </section>
    )
}
