import api from './api'
import type { Review, CreateReviewPayload, UpdateReviewPayload } from '@/types/review'

export const reviewService = {
  getAll: () => api.get<{ success: boolean; message: string; data: Review[] }>('/reviews'),

  create: (payload: CreateReviewPayload) =>
    api.post<{ success: boolean; message: string; data: Review }>('/reviews', payload),

  update: (id: string, payload: UpdateReviewPayload) =>
    api.put<{ success: boolean; message: string; data: Review }>(`/reviews/${id}`, payload),

  remove: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/reviews/${id}`),
}
