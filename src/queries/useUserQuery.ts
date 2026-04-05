'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { userService } from '@/services/userService'
import { useAuthStore } from '@/stores/authStore'
import type { UpdateEmailRequest, VerifyUpdateEmailRequest } from '@/types/auth.types'

export function useGetMeQuery() {
  const { isAuthenticated } = useAuthStore()

  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: async () => {
      const res = await userService.getMe()
      return res.data.data
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  })
}

export function useRequestEmailUpdateMutation() {
  return useMutation({
    mutationFn: (data: UpdateEmailRequest) => userService.requestEmailUpdate(data),
  })
}

export function useVerifyEmailUpdateMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: VerifyUpdateEmailRequest) => userService.verifyEmailUpdate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] })
    },
  })
}
