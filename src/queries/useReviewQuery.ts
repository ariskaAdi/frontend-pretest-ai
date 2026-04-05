'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { reviewService } from '@/services/reviewService'
import type { CreateReviewPayload, UpdateReviewPayload } from '@/types/review'

const REVIEW_KEYS = {
  all: ['reviews'],
}

export function useReviewsQuery() {
  return useQuery({
    queryKey: REVIEW_KEYS.all,
    queryFn: async () => {
      const res = await reviewService.getAll()
      return res.data.data
    },
  })
}

export function useCreateReviewMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateReviewPayload) => reviewService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REVIEW_KEYS.all })
    },
  })
}

export function useUpdateReviewMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateReviewPayload }) =>
      reviewService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REVIEW_KEYS.all })
    },
  })
}

export function useDeleteReviewMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => reviewService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REVIEW_KEYS.all })
    },
  })
}
