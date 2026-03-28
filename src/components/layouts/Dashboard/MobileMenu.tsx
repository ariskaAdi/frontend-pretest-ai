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

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose}
      />
      
      {/* Menu Drawer */}
      <aside className="fixed left-0 top-0 h-full w-72 bg-gray-200 shadow-xl flex flex-col animate-in slide-in-from-left duration-300 ease-out border-r border-gray-100">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
              P
            </div>
            <span className="text-lg font-bold text-gray-900">Pretest AI</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-all active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-8 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-4 px-4 py-3.5 rounded-xl text-base font-medium transition-all duration-200",
                  isActive 
                    ? "bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-primary"
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-6 border-t border-gray-100 bg-gray-50/50">
          <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Butuh Bantuan?</p>
            <p className="text-xs text-gray-500 leading-relaxed mb-3">Hubungi tim kami jika Anda menemui kendala dalam belajar.</p>
            <Link href="/support" className="text-xs font-bold text-primary hover:underline">Pusat Bantuan →</Link>
          </div>
        </div>
      </aside>
    </div>
  )
}
