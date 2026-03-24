import * as React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default'
  children: React.ReactNode
  dot?: boolean
  className?: string
}

export function Badge({
  variant = 'default',
  children,
  dot = false,
  className,
}: BadgeProps) {
  const variantClasses = {
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    default: 'bg-gray-100 text-gray-600',
  }

  const dotClasses = {
    success: 'bg-green-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
    info: 'bg-blue-500',
    default: 'bg-gray-400',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium',
        variantClasses[variant],
        className
      )}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full', dotClasses[variant])} />}
      {children}
    </span>
  )
}
