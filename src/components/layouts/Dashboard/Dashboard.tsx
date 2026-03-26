'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'
import { Sidebar } from '../Sidebar/Sidebar'
import { Navbar } from '../Navbar/Navbar'
import { MobileMenu } from './MobileMenu'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  // Route Protection: Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null // Or a loading spinner
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <Sidebar className="hidden lg:flex" />

      {/* Main Layout Area */}
      <div className="lg:pl-60 flex flex-col min-h-screen">
        {/* Navbar */}
        <Navbar 
          onMenuClick={() => setIsMobileMenuOpen(true)} 
          onLogoutSuccess={() => setIsMobileMenuOpen(false)}
        />

        {/* Mobile Menu Drawer */}
        <MobileMenu 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)} 
        />

        {/* Content Area */}
        <main className="flex-1 pt-24 px-4 pb-12 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
