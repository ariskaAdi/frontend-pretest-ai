import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types/auth.types'

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  setAuth: (token: string, user: User) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setAuth: (token, user) => {
        document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`
        set({ token, user, isAuthenticated: true })
      },
      clearAuth: () => {
        document.cookie = 'token=; path=/; max-age=0'
        set({ token: null, user: null, isAuthenticated: false })
      },
    }),
    { name: 'auth-storage' }
  )
)
