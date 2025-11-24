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
    const bloom =
        theme === 'galaxy'
            ? 'radial-gradient(circle at 20% 20%, rgba(129, 140, 248, 0.18), transparent 50%), radial-gradient(circle at 70% 80%, rgba(59, 130, 246, 0.15), transparent 60%)'
            : 'radial-gradient(circle at 80% 20%, rgba(34, 211, 238, 0.16), transparent 50%), radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.18), transparent 60%)'

    return (
        <section className="text-left">
            <p className="text-xs uppercase tracking-[0.45em] text-white/60">{page}</p>
            <h1 className="mt-2 text-4xl font-semibold leading-tight md:text-5xl">{content.heading}</h1>
            <p className="mt-4 max-w-3xl text-base text-white/80 md:text-lg">{content.subheading}</p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
                {content.blocks.map((block) => (
                    <motion.article
                        key={block.title}
                        className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_15px_45px_rgba(0,0,0,0.25)] backdrop-blur-md"
                        style={{ backgroundImage: bloom }}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                        <div className="pointer-events-none absolute -right-10 top-0 h-24 w-24 rounded-full bg-white/10 blur-3xl" />
                        <h3 className="text-xl font-semibold">{block.title}</h3>
                        <p className="mt-2 text-sm text-white/80">{block.body}</p>
                    </motion.article>
                ))}
            </div>

            <div className="mt-8 inline-flex flex-wrap items-center gap-3">
                <motion.button
                    onClick={onNavigateHome}
                    className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:border-white/50 hover:bg-white/15"
                    whileTap={{ scale: 0.95 }}
                >
                    ← Back to home
                </motion.button>
                <span className="text-xs text-white/70">
                    Maranova = mare (sea) + nova (new star). Two moods, one calm surface.
                </span>
            </div>
        </section>
    )
}
