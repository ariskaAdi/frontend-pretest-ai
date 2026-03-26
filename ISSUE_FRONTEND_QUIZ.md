# ISSUE: Frontend — Quiz Case

## Status
`open`

## Priority
`high`

## Assignee
_unassigned_

## Dependency
- `ISSUE_FRONTEND_SHARED.md` selesai
- `ISSUE_FRONTEND_DASHBOARD.md` selesai
- `ISSUE_FRONTEND_MODULE.md` selesai (modul detail dengan tombol "Buat Quiz" tersedia)

---

## Background

Quiz case mencakup semua interaksi dengan quiz: generate quiz dari modul, mengerjakan soal, submit jawaban, melihat hasil, dan riwayat quiz. Ini adalah fitur inti setelah modul berhasil di-summarize.

---

## Struktur File

```
src/
├── app/
│   └── (dashboard)/
│       └── quiz/
│           ├── page.tsx                ← riwayat quiz + trigger generate
│           └── [id]/
│               ├── page.tsx            ← sesi pengerjaan quiz
│               └── result/
│                   └── page.tsx        ← hasil quiz
│
├── components/
│   └── features/
│       └── quiz/
│           ├── QuizCard.tsx            ← card satu history quiz
│           ├── QuizHistory.tsx         ← grid list quiz history
│           ├── QuizEmpty.tsx           ← empty state history         ← BUAT BARU
│           ├── QuizQuestion.tsx        ← satu soal dengan pilihan
│           ├── QuizResult.tsx          ← tampilan hasil + review soal
│           ├── GenerateQuizModal.tsx   ← modal pilih jumlah soal      ← BUAT BARU
│           └── index.ts                ← barrel export                ← BUAT BARU
│
├── services/
│   └── quizService.ts                  ← EXTEND (tambah method baru)
│
├── queries/
│   └── useQuizQuery.ts                 ← EXTEND (tambah query & mutation)
│
└── types/
    └── quiz.types.ts                   ← REWRITE (tipe lama tidak sesuai backend)
```

---

## ⚠️ Perubahan File yang Sudah Ada

### `src/types/quiz.types.ts` — WAJIB DIUPDATE

Tipe yang ada saat ini **tidak sesuai** dengan response backend:

```ts
// LAMA — salah, field tidak match backend
export interface Quiz {
  title: string          // ← backend kirim module_title, bukan title
  total_questions: number // ← backend kirim num_questions
  score: number          // ← backend bisa null saat status pending
}
```

Ganti seluruh file dengan tipe yang benar:

```ts
// BARU — sesuai backend swagger
export interface QuizQuestion {
  id: string
  text: string
  options: string[]  // ["A. ...", "B. ...", "C. ...", "D. ..."]
}

export interface QuizQuestionResult extends QuizQuestion {
  correct_answer: string  // "A" | "B" | "C" | "D"
  user_answer: string
  is_correct: boolean
}

export interface QuizResponse {
  id: string
  module_id: string
  module_title: string
  num_questions: number
  status: 'pending' | 'completed'
  questions: QuizQuestion[]
  created_at: string
}

export interface QuizResultResponse {
  id: string
  module_id: string
  module_title: string
  num_questions: number
  score: number
  status: 'completed'
  questions: QuizQuestionResult[]
  created_at: string
}

export interface QuizHistoryResponse {
  id: string
  module_id: string
  module_title: string
  num_questions: number
  score: number | null  // null jika belum di-submit
  status: 'pending' | 'completed'
  created_at: string
}

export interface GenerateQuizRequest {
  module_id: string
  num_questions: 5 | 10 | 20
}

export interface SubmitAnswer {
  question_id: string
  answer: 'A' | 'B' | 'C' | 'D'
}

export interface SubmitQuizRequest {
  answers: SubmitAnswer[]
}
```

### `src/app/(dashboard)/dashboard/page.tsx` — PERLU UPDATE KECIL

Dashboard menggunakan field lama. Setelah `quiz.types.ts` diupdate, ganti field yang dipakai:

```tsx
// LAMA
<h4>{quiz.title}</h4>
<p>{quiz.total_questions} Pertanyaan</p>

// BARU
<h4>{quiz.module_title}</h4>
<p>{quiz.num_questions} Pertanyaan</p>
```

> Cukup 2 baris ini. Tidak ada perubahan logika lain.

---

## Services (`src/services/quizService.ts`) — EXTEND

Tambahkan method baru. Jangan hapus `getAll` dan `getHistory` yang sudah ada.

```ts
import api from './api'
import type { APIResponse } from '@/types/api.types'
import type {
  QuizResponse,
  QuizResultResponse,
  QuizHistoryResponse,
  GenerateQuizRequest,
  SubmitQuizRequest,
} from '@/types/quiz.types'

export const quizService = {
  // SUDAH ADA — jangan diubah
  getAll: () => api.get<APIResponse<QuizHistoryResponse[]>>('/quiz'),
  getHistory: () => api.get<APIResponse<QuizHistoryResponse[]>>('/quiz/history'),

  // TAMBAH BARU
  generate: (data: GenerateQuizRequest) =>
    api.post<APIResponse<QuizResponse>>('/quiz', data),

  submit: (quizId: string, data: SubmitQuizRequest) =>
    api.post<APIResponse<QuizResultResponse>>(`/quiz/${quizId}/submit`, data),

  retry: (quizId: string) =>
    api.post<APIResponse<QuizResponse>>(`/quiz/${quizId}/retry`),

  getResult: (quizId: string) =>
    api.get<APIResponse<QuizResultResponse>>(`/quiz/${quizId}/result`),

  getHistoryByModule: (moduleId: string) =>
    api.get<APIResponse<QuizHistoryResponse[]>>(`/quiz/history/module/${moduleId}`),
}
```

---

## TanStack Query (`src/queries/useQuizQuery.ts`) — EXTEND

Tambahkan di bawah yang sudah ada. Jangan hapus `useQuizQuery` dan `useQuizHistoryQuery`.

```ts
// Query Keys
const QUIZ_KEYS = {
  all: ['quizzes'],
  history: ['quizzes', 'history'],
  historyByModule: (moduleId: string) => ['quizzes', 'history', 'module', moduleId],
  session: (id: string) => ['quiz', 'session', id],
  result: (id: string) => ['quiz', 'result', id],
}

// TAMBAH: Query hasil quiz
export function useQuizResultQuery(quizId: string) {
  return useQuery({
    queryKey: QUIZ_KEYS.result(quizId),
    queryFn: async () => {
      const res = await quizService.getResult(quizId)
      return res.data.data
    },
    enabled: !!quizId,
  })
}

// TAMBAH: Query history per modul
export function useQuizHistoryByModuleQuery(moduleId: string) {
  return useQuery({
    queryKey: QUIZ_KEYS.historyByModule(moduleId),
    queryFn: async () => {
      const res = await quizService.getHistoryByModule(moduleId)
      return res.data.data
    },
    enabled: !!moduleId,
  })
}

// TAMBAH: Mutation generate quiz
export function useGenerateQuizMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: GenerateQuizRequest) => quizService.generate(data),
    onSuccess: (res) => {
      const quiz = res.data.data
      // Simpan quiz session ke cache agar halaman /quiz/[id] bisa akses soal
      queryClient.setQueryData(QUIZ_KEYS.session(quiz.id), quiz)
      queryClient.invalidateQueries({ queryKey: QUIZ_KEYS.history })
    },
  })
}

// TAMBAH: Mutation submit quiz
export function useSubmitQuizMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ quizId, data }: { quizId: string; data: SubmitQuizRequest }) =>
      quizService.submit(quizId, data),
    onSuccess: (res, { quizId }) => {
      const result = res.data.data
      // Simpan hasil ke cache agar halaman result bisa akses langsung
      queryClient.setQueryData(QUIZ_KEYS.result(quizId), result)
      queryClient.invalidateQueries({ queryKey: QUIZ_KEYS.history })
    },
  })
}

// TAMBAH: Mutation retry quiz
export function useRetryQuizMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (quizId: string) => quizService.retry(quizId),
    onSuccess: (res) => {
      const quiz = res.data.data
      queryClient.setQueryData(QUIZ_KEYS.session(quiz.id), quiz)
      queryClient.invalidateQueries({ queryKey: QUIZ_KEYS.history })
    },
  })
}
```

> **Catatan penting:** Tidak ada endpoint `GET /quiz/:id` di backend. Data soal hanya tersedia dari response `POST /quiz` (generate) atau `POST /quiz/:id/retry`. Keduanya disimpan ke cache via `setQueryData`. Jika user refresh halaman session, data tidak bisa di-fetch ulang — lihat **BUG-1**.

---

## Alur & Flow Setiap Halaman

### Alur 1 — Riwayat Quiz (`/quiz`)

```
Halaman mount
    ├── Cek query param ?module_id
    │       └── ada → buka GenerateQuizModal otomatis
    │
    └── useQuizHistoryQuery()
            ├── Loading → skeleton card (3 buah)
            ├── Empty  → QuizEmpty component
            │             "Belum ada quiz, pilih modul untuk mulai"
            │             Button "Ke Modul"
            └── Data   → QuizHistory → grid QuizCard
```

**QuizCard — info yang ditampilkan:**

```
┌──────────────────────────────────┐
│  🎯 Pengantar Hukum Indonesia    │
│                                  │
│  10 Pertanyaan                   │
│  [✅ Selesai] atau [⏳ Pending]  │
│                                  │
│  Skor: 80%   |   21 Mar 2026    │
│                                  │
│  [Lihat Hasil]  (jika completed) │
│  [Lanjutkan]    (jika pending)   │
└──────────────────────────────────┘
```

---

### Alur 2 — Generate Quiz (Modal)

Dipicu dari dua tempat:
1. Tombol "Buat Quiz" di halaman detail modul (`/modules/:id`) → navigate ke `/quiz?module_id=xxx`
2. Tombol di halaman `/quiz` jika ada `?module_id` di URL

```
GenerateQuizModal terbuka
    └── Pilih jumlah soal: [5] [10] [20]

Klik "Mulai Quiz"
    └── useGenerateQuizMutation()
            ├── Loading → Button disabled + Spinner
            ├── Success → setQueryData(['quiz','session', id], quiz)
            │            toast.success "Quiz siap!"
            │            redirect ke /quiz/:id
            └── Error   → toast.error pesan dari backend
```

**GenerateQuizModal — tampilan:**

```
┌──────────────────────────────────────┐
│  Buat Quiz                       [×] │
├──────────────────────────────────────┤
│  Modul: Pengantar Hukum Indonesia    │
│                                      │
│  Jumlah Soal:                        │
│  ┌─────┐  ┌─────┐  ┌─────┐          │
│  │  5  │  │ 10  │  │ 20  │          │
│  └─────┘  └─────┘  └─────┘          │
│                                      │
│              [Batal]  [Mulai Quiz]   │
└──────────────────────────────────────┘
```

---

### Alur 3 — Sesi Quiz (`/quiz/:id`)

```
Halaman mount
    └── Ambil data dari cache: getQueryData(['quiz','session', id])
            ├── Tidak ada (refresh) → tampilkan pesan error + tombol kembali
            └── Ada → render soal-soal

State lokal:
    answers: Record<questionId, 'A'|'B'|'C'|'D'> = {}
    currentPage: number (navigasi antar soal)

Layout:
    ├── Progress bar: "Soal 3 dari 10"
    ├── QuizQuestion — soal aktif dengan 4 pilihan
    ├── Navigasi: [← Sebelumnya] [Berikutnya →]
    └── Jika semua terjawab → tampilkan tombol [Submit Quiz]

Klik "Submit Quiz"
    └── Konfirmasi: "Yakin submit? Jawaban tidak bisa diubah"
            └── useSubmitQuizMutation({ quizId, data: { answers } })
                    ├── Loading → Button disabled
                    ├── Success → setQueryData(['quiz','result', id], result)
                    │            redirect ke /quiz/:id/result
                    └── Error   → toast.error
```

**QuizQuestion — tampilan satu soal:**

```
┌────────────────────────────────────────┐
│  Soal 3 dari 10                        │
│  ████████░░░░░░░░░░░░  30%             │
├────────────────────────────────────────┤
│  Apa yang dimaksud dengan hukum        │
│  perdata menurut BW?                   │
├────────────────────────────────────────┤
│  ◉ A. Hukum yang mengatur hubungan...  │  ← dipilih
│  ○ B. Hukum yang mengatur tindak...    │
│  ○ C. Hukum yang berkaitan dengan...   │
│  ○ D. Hukum internasional publik...    │
└────────────────────────────────────────┘
```

---

### Alur 4 — Hasil Quiz (`/quiz/:id/result`)

```
Halaman mount
    └── Cek cache: getQueryData(['quiz','result', id])
            ├── Ada (langsung dari submit)
            └── Tidak ada → useQuizResultQuery(id)  // fetch dari backend

Tampilkan:
    ├── Skor besar di atas: "80 / 100"
    ├── Badge: "Lulus" (≥70) atau "Tidak Lulus" (<70)
    ├── Ringkasan: X benar, Y salah dari Z soal
    ├── Review per soal — QuizResult (semua soal dengan status benar/salah)
    └── Tombol: [🔁 Ulangi Quiz] [← Kembali ke Modul]

Klik "Ulangi Quiz"
    └── useRetryQuizMutation(quizId)
            ├── Success → redirect ke /quiz/:newQuizId
            └── Error   → toast.error
```

**QuizResult — review satu soal:**

```
┌──────────────────────────────────────────────┐
│  ✅ Soal 1                                   │  ← is_correct
│  Apa yang dimaksud dengan hukum perdata?     │
│                                              │
│  A. Hukum yang mengatur hubungan...  ✅      │  ← correct_answer
│  B. Hukum tindak pidana...                  │
│  C. Hukum internasional...                  │
│  D. Hukum adat...                           │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│  ❌ Soal 2                                   │  ← !is_correct
│  Apa dasar hukum perjanjian?                 │
│                                              │
│  A. Pasal 1313 KUHPerdata... 🔴 (pilihanmu) │  ← user_answer (salah)
│  B. Pasal 1320 KUHPerdata... ✅ (benar)     │  ← correct_answer
│  C. Pasal 1233 KUHPerdata...                │
│  D. Pasal 1234 KUHPerdata...                │
└──────────────────────────────────────────────┘
```

---

## Shared Components yang Dipakai

| Component | Dipakai di |
|---|---|
| `Button` | Generate, submit, retry, navigasi soal |
| `Badge` | Status quiz (pending/completed), lulus/tidak lulus |
| `Card` | QuizCard, QuizQuestion, QuizResult per soal |
| `Modal` | GenerateQuizModal, konfirmasi submit |
| `Spinner` | Loading states |
| `Toast` | Semua mutation feedback |

> Tidak ada `Input` atau `Textarea` — semua interaksi quiz via klik pilihan (A/B/C/D).

---

## Catatan Penting

- **Tidak ada `GET /quiz/:id`** — data soal hanya dari response generate/retry. Simpan ke cache via `queryClient.setQueryData`.
- **`num_questions` enum: hanya 5, 10, atau 20** — validasi di frontend, jangan input bebas.
- **`score` nullable** — di `QuizHistoryResponse`, `score` bisa `null` jika quiz belum di-submit. Guard dengan `score ?? '-'` di tampilan.
- **`answers` harus lengkap** — backend reject submit jika tidak semua soal dijawab. Disable tombol Submit jika `Object.keys(answers).length < quiz.questions.length`.
- Setelah submit dan retry, selalu `invalidateQueries` history agar dashboard dan halaman quiz history update otomatis.

---

## Potensi Bug — Wajib Diperhatikan Saat Implementasi

### BUG-1: Data soal hilang jika user refresh halaman sesi quiz

Tidak ada endpoint untuk mengambil soal quiz yang sedang berjalan. Data soal hanya ada di cache memory (dari response `POST /quiz`). Jika user refresh halaman `/quiz/:id`, cache hilang dan soal tidak bisa dimuat.

**Solusi yang harus diimplementasi:**

```tsx
// Di halaman /quiz/[id]/page.tsx
const quizData = queryClient.getQueryData(QUIZ_KEYS.session(id))

if (!quizData) {
  // Tampilkan pesan informatif, BUKAN error mentah
  return (
    <div>
      <p>Sesi quiz tidak ditemukan. Halaman ini tidak bisa dimuat ulang.</p>
      <Button onClick={() => router.push('/quiz')}>Kembali ke Riwayat</Button>
    </div>
  )
}
```

---

### BUG-2: `quiz.types.ts` lama menyebabkan dashboard menampilkan `undefined`

Field lama `title` dan `total_questions` tidak ada di response backend. Dashboard saat ini menampilkan `undefined` di nama modul dan jumlah pertanyaan pada section "Quiz Terakhir".

**File yang harus diupdate bersamaan dengan `quiz.types.ts`:**

| File | Baris | Ganti |
|---|---|---|
| `src/app/(dashboard)/dashboard/page.tsx` | `quiz.title` | `quiz.module_title` |
| `src/app/(dashboard)/dashboard/page.tsx` | `quiz.total_questions` | `quiz.num_questions` |

---

### BUG-3: `useQuizHistoryQuery` di dashboard mengembalikan tipe lama

`useQuizHistoryQuery` di `useQuizQuery.ts` masih mengembalikan `Quiz[]` (tipe lama). Setelah `quiz.types.ts` diupdate, tipe return otomatis berubah karena service mengarah ke tipe baru. Pastikan semua tempat yang consume `useQuizHistoryQuery` menggunakan field baru (`module_title`, `num_questions`).

---

### BUG-4: Submit dengan jawaban tidak lengkap

Backend mengembalikan `400` jika `answers` tidak mencakup semua soal. Frontend wajib menghitung kelengkapan jawaban sebelum menampilkan tombol Submit:

```ts
const allAnswered = quiz.questions.every(q => answers[q.id] !== undefined)
// Disable tombol Submit jika !allAnswered
```

---

### BUG-5: Navigasi ke result page tanpa data jika buka langsung via URL

Jika user buka `/quiz/:id/result` langsung (bukan dari flow submit), cache `['quiz','result', id]` kosong. `useQuizResultQuery` akan fetch ke `GET /quiz/:id/result`. Pastikan query ini di-enable dan loading state ditangani.

```ts
// useQuizResultQuery sudah handle ini dengan initialData dari cache + fallback fetch
// Pastikan halaman result tidak langsung akses data tanpa guard isLoading
```

---

## Definition of Done

- [ ] `quiz.types.ts` diupdate sesuai backend (tipe lama dihapus, tipe baru ditambahkan)
- [ ] Dashboard diupdate: `quiz.title` → `quiz.module_title`, `quiz.total_questions` → `quiz.num_questions`
- [ ] `quizService.ts` ditambah: `generate`, `submit`, `retry`, `getResult`, `getHistoryByModule`
- [ ] `useQuizQuery.ts` ditambah semua query dan mutation baru
- [ ] `GenerateQuizModal.tsx` dengan pilihan 5/10/20 soal
- [ ] `QuizEmpty.tsx` dengan empty state dan tombol ke modul
- [ ] `QuizCard.tsx` dengan status, skor, dan tombol aksi yang sesuai
- [ ] `QuizHistory.tsx` grid list QuizCard
- [ ] `QuizQuestion.tsx` dengan highlight pilihan yang dipilih
- [ ] `QuizResult.tsx` dengan review per soal (benar/salah)
- [ ] Halaman `/quiz` dengan history dan trigger generate
- [ ] Halaman `/quiz/:id` dengan navigasi soal dan submit
- [ ] Halaman `/quiz/:id/result` dengan skor dan retry
- [ ] Refresh session page menampilkan pesan informatif, bukan crash
- [ ] Tombol Submit disabled jika ada soal yang belum dijawab
- [ ] `index.ts` barrel export untuk semua feature components
- [ ] Tidak ada error TypeScript
