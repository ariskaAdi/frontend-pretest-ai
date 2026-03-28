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

import { useSidebarStore } from '@/stores/sidebarStore'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'

// navItems tetap sama...

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname()
  const { isCollapsed, toggle } = useSidebarStore()

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-full bg-gray-200 border-r border-gray-200 flex flex-col z-30 transition-all duration-300 ease-in-out",
      isCollapsed ? "w-16" : "w-60",
      className
    )}>
      {/* Logo Area + Toggle Button */}
      <div className="px-3 py-5 border-b border-gray-100 flex items-center justify-between">
        {/* Logo: sembunyikan teks saat collapsed */}
        <div className="flex items-center gap-2 overflow-hidden min-w-0">
          {!isCollapsed && (
            <>
            <div className="w-8 h-8 shrink-0 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
            P
          </div>
           <span className="text-lg font-bold text-gray-900 whitespace-nowrap">Pretest AI</span>
           </>
          )}
        </div>

        {/* Toggle button: selalu ada di header */}
        <button
          onClick={toggle}
          className="p-1.5 rounded-md text-gray-600 hover:text-gray-700 hover:bg-gray-100 transition-colors shrink-0"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-6 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.label : undefined} // tooltip saat collapsed
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 cursor-pointer",
                isCollapsed && "justify-center px-0",
                isActive
                  ? "bg-primary-light text-primary font-black"
                  : "text-gray-600 font-bold hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <div className={cn(isCollapsed && "scale-110 transition-transform")}>
                {item.icon}
              </div>
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-2 py-4 border-t border-gray-100 mt-auto">
        {!isCollapsed && (
          <p className="text-xs text-center text-gray-400">© 2024 Pretest AI v0.1.0</p>
        )}
      </div>
    </aside>
  )
}
