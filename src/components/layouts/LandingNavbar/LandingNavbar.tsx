'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { label: 'Home',         href: '#hero',      sectionId: 'hero' },
  { label: 'Features',     href: '#fitur',     sectionId: 'fitur' },
  { label: 'About',        href: '#tentang',   sectionId: 'tentang' },
  { label: 'How It Works', href: '#cara-kerja', sectionId: 'cara-kerja' },
  { label: 'Contact',      href: '#contacts',  sectionId: 'contacts' },
]

export function LandingNavbar() {
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    NAV_LINKS.forEach(({ sectionId }) => {
      const el = document.getElementById(sectionId)
      if (!el) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(sectionId)
        },
        { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach(o => o.disconnect())
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const id = href.replace('#', '')
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* Logo */}
        <span className="text-xl font-black text-gray-900 tracking-tight select-none">
          Pretest
          <span className="text-[#AAFF00] bg-[#0D0D0D] px-1 rounded ml-0.5">
            AI
          </span>
        </span>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-500">
          {NAV_LINKS.map(({ label, href, sectionId }) => (
            <a
              key={sectionId}
              href={href}
              onClick={(e) => handleNavClick(e, href)}
              className={cn(
                'transition-colors hover:text-gray-900',
                activeSection === sectionId
                  ? 'text-gray-900 border-b-2 border-gray-900 pb-0.5'
                  : ''
              )}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* CTAs */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-4 py-2"
          >
            Log In
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-full bg-[#0D0D0D] text-white text-sm font-semibold px-5 py-2.5 hover:bg-[#222] transition-colors"
          >
            Start for Free
          </Link>
        </div>
      </div>
    </header>
  )
}
