'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useGetMeQuery } from '@/queries/useUserQuery'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/shared/Button'
import { Modal } from '@/components/shared/Modal'
import { cn } from '@/lib/utils'

import { useSidebarStore } from '@/stores/sidebarStore'

interface NavbarProps {
  onMenuClick?: () => void
  onLogoutSuccess?: () => void
}

export function Navbar({ onMenuClick, onLogoutSuccess }: NavbarProps) {
  const router = useRouter()
  const { data: user } = useGetMeQuery()
  const { clearAuth } = useAuthStore()
  const { isCollapsed } = useSidebarStore()
  
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false)
  
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    clearAuth()
    setIsLogoutModalOpen(false)
    router.push('/login')
    onLogoutSuccess?.()
  }

  return (
    <>
      <header className={cn(
        "fixed top-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 z-20 transition-all duration-300 ease-in-out",
        isCollapsed ? "left-0 lg:left-16" : "left-0 lg:left-60"
      )}>
        {/* Left section: Hamburger (mobile) + Page Title */}
        <div className="flex items-center gap-3">
          <button 
            className="lg:hidden p-2 hover:bg-gray-100 rounded-md transition-colors text-black"
            onClick={onMenuClick}
            aria-label="Open menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          </button>
          
          <h1 className="text-sm lg:text-base font-semibold text-gray-800">
            Dashboard
          </h1>
        </div>

        {/* Right section: User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            className="flex items-center gap-2 lg:gap-3 p-1.5 hover:bg-gray-50 rounded-full lg:rounded-lg transition-colors group"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-primary font-semibold text-sm border-2 border-white shadow-sm overflow-hidden">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-gray-700 leading-tight">
                {user?.name || 'Loading...'}
              </p>
              <p className="text-[10px] text-gray-400 capitalize">
                {user?.role || ''}
              </p>
            </div>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" height="16" 
              viewBox="0 0 24 24" fill="none" 
              stroke="currentColor"  strokeWidth="2" 
              strokeLinecap="round" strokeLinejoin="round" 
              className={cn("text-gray-400 transition-transform duration-200", isDropdownOpen && "rotate-180")}
            >
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-30 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
              
              <div className="px-2 py-1.5">
                <button 
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary rounded-lg transition-colors cursor-pointer"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  Profile
                </button>
                <button 
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-danger hover:bg-danger-light rounded-lg transition-colors cursor-pointer"
                  onClick={() => {
                    setIsDropdownOpen(false)
                    setIsLogoutModalOpen(true)
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      <Modal 
        open={isLogoutModalOpen} 
        onClose={() => setIsLogoutModalOpen(false)}
        title="Konfirmasi Logout"
      >
        <div className="p-1">
          <p className="text-sm text-gray-600 mb-6">
            Apakah Anda yakin ingin keluar dari akun Anda sekarang? Sesi Anda akan dihentikan.
          </p>
          <div className="flex gap-3 justify-end">
            <Button 
              variant="ghost" 
              onClick={() => setIsLogoutModalOpen(false)}
              className="px-6"
            >
              Batal
            </Button>
            <Button 
              variant="danger" 
              onClick={handleLogout}
              className="px-6 shadow-sm shadow-danger/20"
            >
              Logout
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
