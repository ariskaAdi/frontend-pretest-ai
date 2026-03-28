'use client'

import * as React from 'react'
import { Card } from '@/components/shared/Card'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string | number
  icon: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'info' | 'danger'
  description?: string
}

export function StatCard({ 
  label, 
  value, 
  icon, 
  variant = 'default',
  description 
}: StatCardProps) {
  const variantStyles = {
    default: 'text-primary bg-primary-light',
    success: 'text-success bg-success/10',
    warning: 'text-warning bg-warning/10',
    info: 'text-blue-600 bg-blue-50',
    danger: 'text-red-600 bg-red-50',
  }

  return (
    <Card className="p-6 border-none shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative group">
      {/* Decorative background circle */}
      <div className={cn(
        "absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-500",
        variantStyles[variant].split(' ')[1]
      )} />
      
      <div className="flex items-center gap-5 relative z-10">
        <div className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
          variantStyles[variant]
        )}>
          {icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-400 mb-1 truncate">
            {label}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
              {value}
            </h3>
          </div>
          {description && (
            <p className="mt-1 text-xs text-gray-500 truncate italic">
              {description}
            </p>
          )}
        </div>
      </div>
    </Card>
  )
}
