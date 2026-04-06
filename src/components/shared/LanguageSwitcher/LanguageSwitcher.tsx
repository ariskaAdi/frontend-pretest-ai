'use client'

import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Globe } from 'lucide-react'
import { cn } from '@/lib/utils'

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale()
  const router = useRouter()

  const switchLocale = (newLocale: string) => {
    if (newLocale === locale) return
    document.cookie = `locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`
    router.refresh()
  }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <Globe size={14} className="text-gray-400" />
      <button
        onClick={() => switchLocale('id')}
        className={cn(
          'text-xs font-semibold px-1 transition-colors',
          locale === 'id'
            ? 'text-primary'
            : 'text-gray-400 hover:text-gray-700'
        )}
      >
        ID
      </button>
      <span className="text-gray-300 text-xs select-none">|</span>
      <button
        onClick={() => switchLocale('en')}
        className={cn(
          'text-xs font-semibold px-1 transition-colors',
          locale === 'en'
            ? 'text-primary'
            : 'text-gray-400 hover:text-gray-700'
        )}
      >
        EN
      </button>
    </div>
  )
}
