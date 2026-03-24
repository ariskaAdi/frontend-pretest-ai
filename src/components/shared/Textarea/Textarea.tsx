import * as React from 'react'
import { cn } from '@/lib/utils'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

export function Textarea({
  label,
  error,
  helperText,
  className,
  id,
  rows = 4,
  ...props
}: TextareaProps) {
  const textareaId = id || React.useId()

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label htmlFor={textareaId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={rows}
        className={cn(
          'w-full px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white transition-colors duration-200 resize-none',
          'placeholder:text-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
          'disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed',
          error && 'border-danger focus:ring-danger',
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-danger mt-0.5">{error}</span>}
      {!error && helperText && <span className="text-xs text-gray-500 mt-0.5">{helperText}</span>}
    </div>
  )
}
