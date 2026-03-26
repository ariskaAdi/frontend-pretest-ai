'use client'

import { useQuery } from '@tanstack/react-query'
import { userService } from '@/services/userService'
import { useAuthStore } from '@/stores/authStore'

export function useGetMeQuery() {
  const { isAuthenticated } = useAuthStore()

  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: async () => {
      const res = await userService.getMe()
      return res.data.data
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 menit
  })
}
