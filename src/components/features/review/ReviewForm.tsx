'use client'

import * as React from 'react'
import { z } from 'zod'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input, Textarea, Button } from '@/components/shared'
import { useToast } from '@/components/shared/Toast'
import { useCreateReviewMutation, useUpdateReviewMutation } from '@/queries/useReviewQuery'
import type { Review } from '@/types/review'

const EMOJIS = [
  { value: 1, emoji: '😞', label: 'Terrible' },
  { value: 2, emoji: '😕', label: 'Bad' },
  { value: 3, emoji: '😐', label: 'Okay' },
  { value: 4, emoji: '😊', label: 'Good' },
  { value: 5, emoji: '😍', label: 'Amazing' },
]

const reviewSchema = z.object({
  position: z.string().min(1, 'Position is required'),
  review: z.string().min(1, 'Review is required'),
  rating: z.number({ required_error: 'Please select a rating' }).min(1).max(5),
})

type ReviewFormValues = z.infer<typeof reviewSchema>

interface ReviewFormProps {
  /** When provided, the form operates in edit mode */
  editTarget?: Review
  onSuccess?: () => void
}

export function ReviewForm({ editTarget, onSuccess }: ReviewFormProps) {
  const { toast } = useToast()
  const isEditMode = !!editTarget

  const createMutation = useCreateReviewMutation()
  const updateMutation = useUpdateReviewMutation()
  const isPending = createMutation.isPending || updateMutation.isPending

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: editTarget
      ? { position: editTarget.position, review: editTarget.review, rating: editTarget.rating }
      : { position: '', review: '', rating: 0 },
  })

  const selectedRating = watch('rating')

  const onSubmit = (values: ReviewFormValues) => {
    if (isEditMode) {
      updateMutation.mutate(
        { id: editTarget.id, payload: values },
        {
          onSuccess: () => {
            toast.success('Review updated successfully!')
            onSuccess?.()
          },
          onError: () => toast.error('Failed to update review. Please try again.'),
        },
      )
    } else {
      createMutation.mutate(values, {
        onSuccess: () => {
          toast.success('Thank you for your review!')
          reset({ position: '', review: '', rating: 0 })
          onSuccess?.()
        },
        onError: () => toast.error('Failed to submit review. Please try again.'),
      })
    }
  }

  return (
    <div className={`bg-white rounded-2xl border border-gray-100 p-8 w-full mx-auto ${isEditMode ? "max-w-full shadow-none" : "max-w-4xl shadow-lg"}`}>
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black text-gray-900">Customer Review</h2>
        <p className="text-gray-400 text-sm mt-2 leading-relaxed">
          Customer reviews are evaluations and opinions shared by users regarding
          their experiences with our platform.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {/* Position */}
        <Input
          label="Your Position (Required)"
          placeholder="e.g. Software Engineer, Student, Teacher"
          {...register('position')}
          error={errors.position?.message}
        />

        {/* Emoji Rating */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-700">Your Rating</span>
          <Controller
            name="rating"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-3">
                {EMOJIS.map(({ value, emoji, label }) => (
                  <button
                    key={value}
                    type="button"
                    title={label}
                    onClick={() => field.onChange(value)}
                    className={`text-3xl transition-all duration-150 select-none focus:outline-none ${
                      field.value === value
                        ? 'scale-125 opacity-100 drop-shadow-md'
                        : 'opacity-40 hover:opacity-70 hover:scale-110'
                    }`}>
                    {emoji}
                  </button>
                ))}
                {selectedRating > 0 && (
                  <span className="text-xs text-gray-400 ml-1">
                    {EMOJIS.find((e) => e.value === selectedRating)?.label}
                  </span>
                )}
              </div>
            )}
          />
          {errors.rating && (
            <span className="text-xs text-danger mt-0.5">{errors.rating.message}</span>
          )}
        </div>

        {/* Review Textarea */}
        <Textarea
          label="Do you have any thoughts you'd like to share?"
          className='text-black'
          placeholder="Your feedback (Required)"
          rows={4}
          {...register('review')}
          error={errors.review?.message}
        />

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={isPending}
          className="w-full rounded-xl mt-1">
          {isEditMode ? 'Update Review' : 'Submit'}
        </Button>
      </form>
    </div>
  )
}
