'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navItems = [
  { 
    label: 'Dashboard',  
    href: '/dashboard',  
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-home"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    ) 
  },
  { 
    label: 'Modul',      
    href: '/modules',    
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-open"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
    ) 
  },
  { 
    label: 'Quiz',       
    href: '/quiz',        
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clipboard"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>
    ) 
  },
]

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname()

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-full w-60 bg-white border-r border-gray-200 flex flex-col z-30",
      className
    )}>
      {/* Logo Area */}
      <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
          P
        </div>
        <span className="text-lg font-bold text-gray-900">Pretest AI</span>
      </div>

      {/* Navigation section */}
      <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 cursor-pointer",
                isActive 
                  ? "bg-primary-light text-primary" 
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footnote / Version */}
      <div className="px-4 py-4 border-t border-gray-100 mt-auto">
        <p className="text-xs text-center text-gray-400">© 2024 Pretest AI v0.1.0</p>
      </div>
    </aside>
  )
}
