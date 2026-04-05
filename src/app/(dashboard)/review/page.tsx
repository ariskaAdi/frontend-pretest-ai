"use client";

import { Star } from "lucide-react";
import { ReviewList } from "@/components/features/review/ReviewList";
import { ReviewForm } from "@/components/features/review/ReviewForm";
import { ReviewCard } from "@/components/features/review/ReviewCard";
import { useGetMeQuery } from "@/queries/useUserQuery";
import { useReviewsQuery } from "@/queries/useReviewQuery";

export default function ReviewPage() {
  const { data: user } = useGetMeQuery();
  const { data: reviews } = useReviewsQuery();

  const myReview = reviews?.find((r) => r.username === user?.name) ?? null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Reviews
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Share your experience and read what others say about Pretest AI
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center">
          <Star size={20} strokeWidth={2.5} />
        </div>
      </div>

      {/* My Review section */}
      {myReview ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 border-t border-gray-100" />
            <span className="text-xs text-gray-400 font-medium uppercase tracking-widest">
              Your Review
            </span>
            <div className="flex-1 border-t border-gray-100" />
          </div>
          <div className="max-w-full mx-auto">
            <ReviewCard
              review={myReview}
              currentUsername={user?.name}
            />
          </div>
        </div>
      ) : (
        <ReviewForm />
      )}

      {/* All Reviews */}
      <div className="flex items-center gap-4">
        <div className="flex-1 border-t border-gray-100" />
        <span className="text-xs text-gray-400 font-medium uppercase tracking-widest">
          All Reviews
        </span>
        <div className="flex-1 border-t border-gray-100" />
      </div>

      <ReviewList currentUsername={user?.name} />
    </div>
  );
}
