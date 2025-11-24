import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

type TypewriterProps = {
    text: string
    delay?: number
    speed?: number
    className?: string
}

export function Typewriter({ text, delay = 0, speed = 120, className = '' }: TypewriterProps) {
    const [displayedText, setDisplayedText] = useState('')
    const [currentIndex, setCurrentIndex] = useState(-1)

    useEffect(() => {
        if (currentIndex === -1) {
            const initialDelay = setTimeout(() => {
                setCurrentIndex(0)
            }, delay)
            return () => clearTimeout(initialDelay)
        }

        if (currentIndex >= 0 && currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText((prev) => prev + text[currentIndex])
                setCurrentIndex((prev) => prev + 1)
            }, speed)

            return () => clearTimeout(timeout)
        }
    }, [currentIndex, delay, speed, text])

    return (
        <span className={className}>
            {displayedText}
            {currentIndex < text.length && (
                <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
                    className="inline-block"
                >
                    |
                </motion.span>
            )}
        </span>
    )
}
