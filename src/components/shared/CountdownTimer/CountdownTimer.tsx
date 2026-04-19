'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface CountdownTimerProps {
  endTime: Date
  onExpire: () => void
  className?: string
}

export function CountdownTimer({ endTime, onExpire, className }: CountdownTimerProps) {
  const [remaining, setRemaining] = React.useState(() =>
    Math.max(0, endTime.getTime() - Date.now())
  )

  const onExpireRef = React.useRef(onExpire)
  onExpireRef.current = onExpire
  const firedRef = React.useRef(false)

  React.useEffect(() => {
    if (remaining <= 0 && !firedRef.current) {
      firedRef.current = true
      onExpireRef.current()
      return
    }

    const interval = setInterval(() => {
      const rem = Math.max(0, endTime.getTime() - Date.now())
      setRemaining(rem)
      if (rem <= 0 && !firedRef.current) {
        firedRef.current = true
        clearInterval(interval)
        onExpireRef.current()
      }
    }, 500)

    return () => clearInterval(interval)
  }, [endTime])

  const totalSeconds = Math.floor(remaining / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  const isWarning = remaining > 0 && remaining < 5 * 60 * 1000
  const isCritical = remaining > 0 && remaining < 60 * 1000

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono font-bold text-sm transition-colors select-none',
        isCritical
          ? 'bg-danger/10 text-danger animate-pulse'
          : isWarning
          ? 'bg-warning/10 text-warning'
          : 'bg-gray-100 text-gray-700',
        className
      )}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
      <span>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  )
}
