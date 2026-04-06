'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Menu, X, ChevronDown, User, LogOut } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useGetMeQuery } from '@/queries/useUserQuery'
import { useAuthStore } from '@/stores/authStore'
import { useSidebarStore } from '@/stores/sidebarStore'
import { Button } from '@/components/shared/Button'
import { Modal } from '@/components/shared/Modal'
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher'
import { cn } from '@/lib/utils'

interface NavbarProps {
  onMenuClick?: () => void
  onLogoutSuccess?: () => void
  isMobileMenuOpen?: boolean
}

export function Navbar({ onMenuClick, onLogoutSuccess, isMobileMenuOpen }: NavbarProps) {
  const router = useRouter()
  const t = useTranslations('Navbar')
  const { data: user } = useGetMeQuery()
  const { clearAuth } = useAuthStore()
  const { isCollapsed } = useSidebarStore()

  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false)

  const dropdownRef = React.useRef<HTMLDivElement>(null)

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
        {/* Left: Hamburger + Title */}
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden p-2 hover:bg-gray-100 rounded-md transition-colors text-gray-700"
            onClick={onMenuClick}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}>
            <span className={cn(
              "block transition-transform duration-300 ease-in-out",
              isMobileMenuOpen ? "rotate-90" : "rotate-0"
            )}>
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </span>
          </button>

          <h1 className="text-sm lg:text-base font-semibold text-gray-800">
            {t('title')}
          </h1>
        </div>

        {/* Right: Language Switcher + User dropdown */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />

          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center gap-2 lg:gap-3 p-1.5 hover:bg-gray-50 rounded-full lg:rounded-lg transition-colors"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-primary font-semibold text-sm border-2 border-white shadow-sm">
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
              <ChevronDown
                size={16}
                className={cn(
                  "text-gray-400 transition-transform duration-200",
                  isDropdownOpen && "rotate-180"
                )}
              />
            </button>

            {/* Dropdown */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-30 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
                <div className="px-2 py-1.5">
                  <button
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary rounded-lg transition-colors cursor-pointer"
                    onClick={() => setIsDropdownOpen(false)}>
                    <User size={16} />
                    {t('profile')}
                  </button>
                  <button
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-danger hover:bg-danger-light rounded-lg transition-colors cursor-pointer"
                    onClick={() => {
                      setIsDropdownOpen(false)
                      setIsLogoutModalOpen(true)
                    }}>
                    <LogOut size={16} />
                    {t('logout')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      <Modal
        open={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title={t('logoutTitle')}>
        <div className="p-1">
          <p className="text-sm text-gray-600 mb-6">
            {t('logoutMessage')}
          </p>
          <div className="flex gap-3 justify-end">
            <Button
              variant="ghost"
              onClick={() => setIsLogoutModalOpen(false)}
              className="px-6">
              {t('cancel')}
            </Button>
            <Button
              variant="danger"
              onClick={handleLogout}
              className="px-6 shadow-sm shadow-danger/20">
              {t('logout')}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
