import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
type ThemeMode = 'galaxy' | 'ocean'

type ThemeTransitionProps = {
  theme: ThemeMode
  trigger: number
}

export function ThemeTransition({ theme, trigger }: ThemeTransitionProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [activeTrigger, setActiveTrigger] = useState(trigger)

  const isOcean = theme === 'ocean'

  useEffect(() => {
    setActiveTrigger(trigger)
    setIsVisible(true)

    const timer = window.setTimeout(() => setIsVisible(false), 1200)
    return () => window.clearTimeout(timer)
  }, [trigger])

  const haloGradient = isOcean
    ? 'radial-gradient(circle at 50% 45%, #fff8e5 0%, #e1f5ff 35%, #b6e2ff 55%, rgba(255, 255, 255, 0) 75%)'
    : 'radial-gradient(circle at 50% 45%, #1e1b4b 0%, #0b1026 40%, #050712 60%, rgba(2, 6, 23, 0) 75%)'

  const veilGradient = isOcean
    ? 'linear-gradient(135deg, rgba(255,255,255,0.55), rgba(226, 244, 255, 0.35), rgba(255,255,255,0.5))'
    : 'linear-gradient(135deg, rgba(76, 54, 169, 0.45), rgba(14, 18, 35, 0.8), rgba(35, 47, 88, 0.35))'

  const glowGradient = isOcean
    ? 'radial-gradient(circle at 35% 30%, rgba(255, 243, 196, 0.55), transparent 28%), radial-gradient(circle at 65% 70%, rgba(158, 222, 255, 0.45), transparent 32%)'
    : 'radial-gradient(circle at 30% 30%, rgba(129, 140, 248, 0.45), transparent 26%), radial-gradient(circle at 70% 70%, rgba(15, 23, 42, 0.65), transparent 30%)'

  const orbCore = isOcean
    ? 'radial-gradient(circle at 35% 35%, #fff7d6 0%, #ffd166 45%, #f59e0b 70%)'
    : 'radial-gradient(circle at 40% 40%, #d1d5ff 0%, #818cf8 45%, #312e81 70%)'

  const orbCrescent = isOcean
    ? 'radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.45) 45%, rgba(255, 255, 255, 0) 70%)'
    : 'radial-gradient(circle at 60% 50%, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.35) 55%, rgba(15, 23, 42, 0) 70%)'

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key={activeTrigger}
          className="pointer-events-none fixed inset-0 z-40 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <motion.div
            className="absolute inset-0 backdrop-blur-[18px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: isOcean ? 0.55 : 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
            style={{ background: veilGradient }}
          />

          <motion.div
            className="absolute left-1/2 top-1/2 aspect-square w-[70vw] max-w-[960px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: haloGradient, filter: 'blur(12px)' }}
            initial={{ scale: 0.25, opacity: 0.75, rotate: -8 }}
            animate={{ scale: isOcean ? 3.6 : 3.1, opacity: 0, rotate: isOcean ? 10 : -10 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: 'easeInOut' }}
          />

          <motion.div
            className="absolute inset-0"
            style={{ background: glowGradient, mixBlendMode: 'screen' as const, filter: 'blur(12px)' }}
            initial={{ opacity: 0, rotate: -6 }}
            animate={{ opacity: 0.55, rotate: isOcean ? 4 : -4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
          />

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <motion.div
              className="relative h-24 w-24 md:h-28 md:w-28"
              initial={{ scale: 0.7, rotate: -12, opacity: 0 }}
              animate={{ scale: 1.05, rotate: isOcean ? 14 : -8, opacity: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.85, ease: 'easeOut' }}
            >
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ background: orbCore, boxShadow: '0 0 60px rgba(255,255,255,0.35)' }}
                initial={{ opacity: 0.9 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
              <motion.div
                className="absolute inset-3 rounded-full"
                style={{ background: orbCrescent, filter: isOcean ? 'blur(0px)' : 'blur(1px)' }}
                initial={{ x: isOcean ? -6 : 6, opacity: 0 }}
                animate={{ x: isOcean ? -3 : 3, opacity: isOcean ? 0.35 : 0.6 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
