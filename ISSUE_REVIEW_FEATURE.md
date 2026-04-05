# Issue: Add Review Feature

## Summary

Build a review submission form and a review list display for authenticated users. The `username` field is automatically populated from the logged-in user's session — the user only fills in `position`, `review`, and `rating` (1–5 stars). Authenticated users can also edit and delete their own reviews.

---

## API Contract

Reference: `backend-pretest-ai/doc/review/swagger.yml`

| Method | Endpoint                  | Auth     | Description                              |
|--------|---------------------------|----------|------------------------------------------|
| GET    | `/api/v1/reviews`         | Public   | Fetch all reviews                        |
| POST   | `/api/v1/reviews`         | Required | Submit a new review                      |
| PUT    | `/api/v1/reviews/{id}`    | Required | Update own review (author only)          |
| DELETE | `/api/v1/reviews/{id}`    | Required | Delete own review (author only)          |

### Request body (POST & PUT)

```json
{
  "position": "Senior Software Engineer",
  "review": "This platform is amazing, it helped me learn Go so fast!",
  "rating": 5
}
```

### Response wrapper

All endpoints return the standard envelope:

```json
{
  "success": true,
  "message": "...",
  "data": { }
}
```

### `ReviewResponse` object

```json
{
  "id": "uuid",
  "username": "johndoe",
  "position": "Senior Software Engineer",
  "review": "This platform is amazing, it helped me learn Go so fast!",
  "rating": 5,
  "created_at": "2026-04-05T10:00:00Z"
}
```

### Error responses

| Status | Meaning                                  |
|--------|------------------------------------------|
| 400    | Invalid request format / validation fail |
| 401    | Unauthorized or not the author           |
| 404    | Review or user not found                 |
| 500    | Internal server error                    |

---

## Types

### `src/types/review.ts`

```ts
export interface Review {
  id: string;
  username: string;
  position: string;
  review: string;
  rating: number;      // 1–5
  created_at: string;
}

export interface CreateReviewPayload {
  position: string;
  review: string;
  rating: number;
}

// PUT uses the same shape as POST
export type UpdateReviewPayload = CreateReviewPayload;
```

---

## Service

### `src/services/reviewService.ts`

```ts
import api from "./api";
import { Review, CreateReviewPayload, UpdateReviewPayload } from "@/types/review";

export const reviewService = {
  getAll: (): Promise<Review[]> =>
    api.get("/reviews").then((res) => res.data.data),

  create: (payload: CreateReviewPayload): Promise<Review> =>
    api.post("/reviews", payload).then((res) => res.data.data),

  update: (id: string, payload: UpdateReviewPayload): Promise<Review> =>
    api.put(`/reviews/${id}`, payload).then((res) => res.data.data),

  remove: (id: string): Promise<void> =>
    api.delete(`/reviews/${id}`).then(() => undefined),
};
```

---

## Query / Mutation Hooks

### `src/queries/reviewQueries.ts`

```ts
// useReviews()        — fetch all reviews (public, no auth needed)
// useCreateReview()   — mutation to submit a new review (requires auth)
// useUpdateReview()   — mutation to update own review by id (requires auth)
// useDeleteReview()   — mutation to delete own review by id (requires auth)
```

Use TanStack Query (`useQuery` / `useMutation`) consistent with the existing query files in `src/queries/`.  
Invalidate `useReviews` query cache on successful create, update, or delete.

---

## Components

### `src/components/reviews/ReviewForm.tsx`

Form fields:
- **Position** — text input (`required`)
- **Review** — textarea (`required`)
- **Rating** — interactive 5-star selector (`required`, value 1–5)

Behaviour:
- Used for both **create** and **edit** modes. Accept optional `defaultValues` and `reviewId` props for edit mode.
- Username is **not** shown in the form; it is sent automatically via the auth token.
- On submit, call `useCreateReview` (create mode) or `useUpdateReview` (edit mode).
- Show loading state on submit button.
- Show success toast / message on completion.
- Show error message if submission fails.

### `src/components/reviews/ReviewCard.tsx`

Display a single review:
- Username and position
- Star rating (filled / empty stars, read-only)
- Review text
- Formatted `created_at` date
- **Edit** and **Delete** buttons — visible only when the logged-in user's username matches the review's `username`.
  - Edit opens `ReviewForm` pre-filled with existing values.
  - Delete calls `useDeleteReview` with a confirmation prompt.

### `src/components/reviews/ReviewList.tsx`

- Fetch all reviews via `useReviews()`.
- Render a grid/list of `<ReviewCard />`.
- Show empty state when no reviews exist.
- Show loading skeleton while fetching.

---

## Pages / Routes

### Option A — Dedicated review page (dashboard)

`src/app/(dashboard)/reviews/page.tsx`

- Show `<ReviewList />` at the top.
- Show `<ReviewForm />` below (visible to authenticated users only).

### Option B — Landing page section

Add a `Reviews` section to `src/app/page.tsx`:
- `<ReviewList />` is public.
- `<ReviewForm />` is shown only when the user is logged in.

> Choose whichever option fits the existing page layout best.

---

## Acceptance Criteria

- [ ] `src/types/review.ts` — `Review`, `CreateReviewPayload`, `UpdateReviewPayload` defined.
- [ ] `src/services/reviewService.ts` — `getAll`, `create`, `update`, `remove` methods.
- [ ] TanStack Query hooks: `useReviews`, `useCreateReview`, `useUpdateReview`, `useDeleteReview`.
- [ ] `ReviewForm` component: create and edit modes; position, review text, 5-star rating; username from session.
- [ ] `ReviewCard` component: displays username, position, star rating, review text, date; edit/delete actions for own reviews only.
- [ ] `ReviewList` component: fetches and renders all reviews with empty and loading states.
- [ ] Page or section wired to display the list and form.
- [ ] No other existing pages, components, or logic are modified.
