'use client'

import { useReviewsQuery } from '@/queries/useReviewQuery'
import { ReviewCard } from './ReviewCard'

interface ReviewListProps {
  currentUsername?: string
}

export function ReviewList({ currentUsername }: ReviewListProps) {
  const { data: reviews, isLoading, isError } = useReviewsQuery()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gray-100" />
              <div className="flex flex-col gap-2">
                <div className="h-3 w-24 bg-gray-100 rounded" />
                <div className="h-2 w-16 bg-gray-100 rounded" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-2 bg-gray-100 rounded w-full" />
              <div className="h-2 bg-gray-100 rounded w-4/5" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <p className="text-gray-400 text-sm text-center py-8">
        Failed to load reviews. Please try again later.
      </p>
    )
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-2xl">
        <p className="text-gray-400 text-sm">No reviews yet. Be the first to share your experience!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} currentUsername={currentUsername} />
      ))}
    </div>
  )
}
