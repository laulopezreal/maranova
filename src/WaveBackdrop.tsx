import React from 'react'
import './WaveBackdrop.css'
import type { Theme } from './App'

interface WaveBackdropProps {
  theme: Theme
}

export const WaveBackdrop: React.FC<WaveBackdropProps> = ({ theme }) => {
  const isOcean = theme === 'ocean'
  const primaryGradientId = `wave-primary-${theme}`
  const highlightGradientId = `wave-highlight-${theme}`

  const primaryStops = isOcean
    ? [
        { offset: '0%', color: 'rgba(148, 197, 255, 0.55)' },
        { offset: '100%', color: 'rgba(12, 74, 110, 0.38)' }
      ]
    : [
        { offset: '0%', color: 'rgba(30, 41, 89, 0.65)' },
        { offset: '100%', color: 'rgba(17, 24, 39, 0.42)' }
      ]

  const highlightStops = isOcean
    ? [
        { offset: '0%', color: 'rgba(224, 242, 255, 0.9)' },
        { offset: '100%', color: 'rgba(148, 197, 255, 0.65)' }
      ]
    : [
        { offset: '0%', color: 'rgba(79, 70, 229, 0.7)' },
        { offset: '100%', color: 'rgba(99, 102, 241, 0.35)' }
      ]

  return (
    <div className="wave-wrapper" aria-hidden>
      <svg className={`wave-layer wave-layer-${theme} wave-layer-primary`} viewBox="0 0 1440 320" preserveAspectRatio="none">
        <defs>
          <linearGradient id={primaryGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            {primaryStops.map((stop, index) => (
              <stop key={`${primaryGradientId}-${index}`} offset={stop.offset} stopColor={stop.color} />
            ))}
          </linearGradient>
        </defs>
        <path
          d="M0,224 C240,256 480,160 720,186 C960,212 1200,288 1440,256 L1440,320 L0,320 Z"
          fill={`url(#${primaryGradientId})`}
        />
      </svg>

      <svg className={`wave-layer wave-layer-${theme} wave-layer-highlight`} viewBox="0 0 1440 320" preserveAspectRatio="none">
        <defs>
          <linearGradient id={highlightGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            {highlightStops.map((stop, index) => (
              <stop key={`${highlightGradientId}-${index}`} offset={stop.offset} stopColor={stop.color} />
            ))}
          </linearGradient>
        </defs>
        <path
          d="M0,192 C240,160 480,256 720,234 C960,212 1200,128 1440,170 L1440,320 L0,320 Z"
          fill={`url(#${highlightGradientId})`}
        />
      </svg>
    </div>
  )
}
