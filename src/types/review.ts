export interface Review {
  id: string
  username: string
  position: string
  review: string
  rating: number // 1–5
  created_at: string
}

export interface CreateReviewPayload {
  position: string
  review: string
  rating: number
}

export type UpdateReviewPayload = CreateReviewPayload
