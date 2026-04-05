'use client'

import * as React from 'react'
import { useToast } from '@/components/shared/Toast'
import { useDeleteReviewMutation } from '@/queries/useReviewQuery'
import { ReviewForm } from './ReviewForm'
import type { Review } from '@/types/review'
import { Button } from '@/components/shared'

const EMOJIS: Record<number, string> = { 1: '😞', 2: '😕', 3: '😐', 4: '😊', 5: '😍' }

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={`text-sm ${i < rating ? 'text-amber-400' : 'text-gray-200'}`}>
          ★
        </span>
      ))}
    </div>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

interface ReviewCardProps {
  review: Review
  currentUsername?: string
}

export function ReviewCard({ review, currentUsername }: ReviewCardProps) {
  const { toast } = useToast()
  const deleteMutation = useDeleteReviewMutation()
  const [isEditing, setIsEditing] = React.useState(false)

  const isOwner = !!currentUsername && currentUsername === review.username

  const handleDelete = () => {
    if (!confirm('Are you sure you want to delete this review?')) return
    deleteMutation.mutate(review.id, {
      onSuccess: () => toast.success('Review deleted.'),
      onError: () => toast.error('Failed to delete review.'),
    })
  }

  if (isEditing) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 w-full max-w-full">
        <div className="flex justify-end mb-3">
          <Button
            onClick={() => setIsEditing(false)}
            className="bg-red-500 text-gray-white hover:bg-white hover:text-red-500 border border-red-500 hover:border-red-500">
            Cancel
          </Button>
        </div>
        <ReviewForm editTarget={review} onSuccess={() => setIsEditing(false)} />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3 max-w-sm">
      {/* Top row: avatar + name/position + emoji */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-light text-primary flex items-center justify-center text-sm font-bold shrink-0">
            {review.username[0].toUpperCase()}
          </div>
          <div>
            <p className="text-gray-900 font-bold text-sm">{review.username}</p>
            <p className="text-gray-400 text-xs">{review.position}</p>
          </div>
        </div>
        <span className="text-2xl" title={`${review.rating} / 5`}>
          {EMOJIS[review.rating] ?? '😐'}
        </span>
      </div>

      {/* Review text */}
      <p className="text-gray-600 text-sm leading-relaxed">&ldquo;{review.review}&rdquo;</p>

      {/* Star rating + date */}
      <div className="flex items-center justify-between">
        <StarRating rating={review.rating} />
        <span className="text-gray-400 text-xs">{formatDate(review.created_at)}</span>
      </div>

      {/* Owner actions */}
      {isOwner && (
        <div className="flex gap-2 pt-1 border-t border-gray-100">
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs text-primary hover:text-primary-hover transition-colors font-medium">
            Edit
          </button>
          <span className="text-gray-200">|</span>
          <button
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="text-xs text-danger/70 hover:text-danger transition-colors disabled:opacity-50">
            {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      )}
    </div>
  )
}
