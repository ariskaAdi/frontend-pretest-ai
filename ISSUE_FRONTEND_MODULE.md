# ISSUE: Frontend — Module Case

## Status
`open`

## Priority
`high`

## Assignee
_unassigned_

## Dependency
- `ISSUE_FRONTEND_SHARED.md` selesai
- `ISSUE_FRONTEND_DASHBOARD.md` selesai (DashboardLayout tersedia)

---

## Background

Module case mencakup semua interaksi dengan modul PDF: upload, melihat daftar, detail modul, melihat summary, dan mengedit summary. Ini adalah fitur inti aplikasi sebelum user bisa generate quiz.

---

## Struktur File

```
src/
├── app/
│   └── (dashboard)/
│       └── modules/
│           ├── page.tsx                ← list modul
│           ├── upload/
│           │   └── page.tsx            ← upload PDF
│           └── [id]/
│               ├── page.tsx            ← detail modul
│               └── summary/
│                   └── page.tsx        ← edit summary
│
├── components/
│   └── features/
│       └── module/
│           ├── ModuleCard.tsx          ← card satu modul
│           ├── ModuleList.tsx          ← grid list modul
│           ├── ModuleEmpty.tsx         ← empty state
│           ├── UploadForm.tsx          ← form upload PDF
│           └── SummaryEditor.tsx       ← editor summary
│
├── services/
│   └── moduleService.ts
│
├── queries/
│   └── useModuleQuery.ts
│
└── types/
    └── module.types.ts
```

---

## Types (`src/types/module.types.ts`)

```ts
export interface Module {
  id: string
  title: string
  file_url: string
  is_summarized: boolean
  created_at: string
}

export interface ModuleDetail extends Module {
  summary: string
}

export interface UploadModuleRequest {
  title: string
  file: File
}

export interface UpdateSummaryRequest {
  summary: string
}

export interface SummaryResponse {
  module_id: string
  module_title: string
  summary: string
  is_summarized: boolean
  updated_at: string
}
```

---

## Services (`src/services/moduleService.ts`)

```ts
export const moduleService = {
  upload: (data: FormData) =>
    api.post<Module>('/modules', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  getAll: () =>
    api.get<Module[]>('/modules'),

  getById: (id: string) =>
    api.get<ModuleDetail>(`/modules/${id}`),

  remove: (id: string) =>
    api.delete(`/modules/${id}`),

  getSummary: (moduleId: string) =>
    api.get<SummaryResponse>(`/summary/${moduleId}`),

  updateSummary: (moduleId: string, data: UpdateSummaryRequest) =>
    api.put<SummaryResponse>(`/summary/${moduleId}`, data),
}
```

---

## TanStack Query (`src/queries/useModuleQuery.ts`)

```ts
// Query Keys
const MODULE_KEYS = {
  all: ['modules'],
  detail: (id: string) => ['modules', id],
  summary: (id: string) => ['summary', id],
}

export function useModulesQuery() {
  return useQuery({
    queryKey: MODULE_KEYS.all,
    queryFn: moduleService.getAll,
  })
}

export function useModuleDetailQuery(id: string) {
  return useQuery({
    queryKey: MODULE_KEYS.detail(id),
    queryFn: () => moduleService.getById(id),
    enabled: !!id,
  })
}

export function useSummaryQuery(moduleId: string, enabled: boolean) {
  return useQuery({
    queryKey: MODULE_KEYS.summary(moduleId),
    queryFn: () => moduleService.getSummary(moduleId),
    enabled: !!moduleId && enabled,  // hanya fetch jika is_summarized = true
    retry: false,
  })
}

export function useUploadModuleMutation() { ... }
export function useDeleteModuleMutation() { ... }
export function useUpdateSummaryMutation() { ... }
```

---

## Alur & Flow Setiap Halaman

### Alur 1 — List Modul (`/modules`)

```
Halaman mount → useModulesQuery()
    ├── Loading → skeleton card (3 buah)
    ├── Empty  → ModuleEmpty component
    │             "Belum ada modul, upload PDF pertamamu"
    │             Button "Upload Modul"
    └── Data   → ModuleList → grid ModuleCard
```

**ModuleCard — info yang ditampilkan:**
```
┌──────────────────────────────┐
│  📄 Pengantar Hukum Indonesia│
│                              │
│  ✅ Ringkasan tersedia       │  ← Badge success
│  atau                        │
│  ⏳ Sedang diproses...       │  ← Badge warning + polling
│                              │
│  21 Mar 2026                 │
│                              │
│  [Lihat Detail] [🗑 Hapus]   │
└──────────────────────────────┘
```

**Polling untuk modul yang belum summarized:**

Modul dengan `is_summarized = false` perlu polling sampai summary selesai:

```ts
useQuery({
  queryKey: MODULE_KEYS.detail(id),
  queryFn: () => moduleService.getById(id),
  refetchInterval: (data) =>
    data?.is_summarized === false ? 5000 : false, // poll tiap 5 detik sampai true
})
```

**Hapus modul:**
- Klik ikon hapus → Modal konfirmasi
- Konfirmasi → `useDeleteModuleMutation()`
- Success → `invalidateQueries(MODULE_KEYS.all)` → list refresh otomatis

---

### Alur 2 — Upload PDF (`/modules/upload`)

```
User isi form:
  - Title (Input)
  - File PDF (drag & drop atau klik)
    └── Validasi client: harus .pdf, max 20MB

Klik "Upload"
    └── useUploadModuleMutation()
            ├── Buat FormData: append title + file
            ├── Loading → progress bar / Spinner
            ├── Success → toast.success
            │            invalidateQueries modules
            │            redirect ke /modules
            └── Error   → toast.error pesan dari backend
```

**UploadForm — komponen file input:**

```
┌────────────────────────────────────┐
│                                    │
│   📁 Drag & drop PDF di sini       │
│   atau klik untuk pilih file       │
│                                    │
│   Format: PDF | Maks: 20MB         │
└────────────────────────────────────┘
```

Setelah file dipilih, tampilkan preview:
```
✅ nama-file.pdf (2.4 MB)  [×]
```

---

### Alur 3 — Detail Modul (`/modules/:id`)

```
Halaman mount → useModuleDetailQuery(id)
    ├── Loading → skeleton
    └── Data   → tampilkan info modul

Cek is_summarized:
    ├── false → Badge "Sedang diproses..."
    │           polling tiap 5 detik
    │           Button "Lihat Summary" disabled
    └── true  → Badge "Ringkasan tersedia"
                Button "Lihat Summary" → /modules/:id/summary
                Button "Buat Quiz"     → trigger generate quiz
```

**Layout halaman detail:**
```
┌─────────────────────────────────────────┐
│ ← Kembali ke Modul                      │
├─────────────────────────────────────────┤
│ Pengantar Hukum Indonesia               │
│ Diupload: 21 Mar 2026                   │
│ [✅ Ringkasan tersedia]                 │
├─────────────────────────────────────────┤
│ [📄 Buka PDF]  [📝 Lihat Summary]      │
│ [🎯 Buat Quiz]  [🗑 Hapus Modul]       │
└─────────────────────────────────────────┘
```

---

### Alur 4 — Summary (`/modules/:id/summary`)

```
Halaman mount → useSummaryQuery(moduleId, is_summarized)
    ├── Loading → skeleton textarea
    └── Data   → tampilkan summary di SummaryEditor

Mode VIEW (default):
    └── Teks summary (read-only)
        Button "Edit Summary"

Mode EDIT (klik Edit):
    └── Textarea bisa diedit
        Button "Simpan" → useUpdateSummaryMutation()
                ├── Loading → Button disabled
                ├── Success → kembali ke mode VIEW
                │            toast.success "Summary diperbarui"
                └── Error   → toast.error
        Button "Batal"  → kembali ke mode VIEW tanpa simpan
```

**SummaryEditor — toggle view/edit mode:**

```ts
const [isEditing, setIsEditing] = useState(false)
const [draft, setDraft] = useState(summary)
```

---

## Shared Components yang Dipakai

| Component | Dipakai di |
|---|---|
| `Button` | Upload, hapus, edit, simpan |
| `Input` | Form title di UploadForm |
| `Textarea` | SummaryEditor mode edit |
| `Card` | ModuleCard |
| `Badge` | Status is_summarized |
| `Modal` | Konfirmasi hapus modul |
| `Spinner` | Loading states |
| `Toast` | Semua mutation feedback |

---

## Catatan Penting

- Upload menggunakan `multipart/form-data` — jangan lupa set header di axios
- Summary belum tentu langsung tersedia setelah upload — implementasi **polling** wajib ada
- Setelah delete, `invalidateQueries` agar list otomatis refresh tanpa reload halaman
- `useSummaryQuery` hanya di-enable jika `is_summarized === true`

---

## Potensi Bug — Wajib Diperhatikan Saat Implementasi

### BUG-1: `moduleService.ts` — Tipe respons tidak dibungkus `APIResponse`

Backend membungkus semua respons dalam `APIResponse<T> = { success, message, data: T }`.
Tiga method di service salah tipe sehingga akan menghasilkan `undefined` saat data diakses:

| Method | Salah (dari ISSUE doc) | Benar |
|---|---|---|
| `upload` | `api.post<Module>` | `api.post<APIResponse<Module>>` |
| `getSummary` | `api.get<SummaryResponse>` | `api.get<APIResponse<SummaryResponse>>` |
| `updateSummary` | `api.put<SummaryResponse>` | `api.put<APIResponse<SummaryResponse>>` |

> Jika tidak diperbaiki, `res.data.summary` dan `res.data.module_title` akan selalu `undefined` di runtime.

---

### BUG-2: `useModuleQuery.ts` — Callback `refetchInterval` salah di TanStack Query v5

Contoh di ISSUE doc menggunakan sintaks TanStack Query **v4**:

```ts
// SALAH — v4 syntax, tidak berfungsi di v5
refetchInterval: (data) => data?.is_summarized === false ? 5000 : false
```

Project ini menggunakan **TanStack Query v5**. Di v5, callback menerima objek `Query`, bukan data langsung. Akibatnya polling **tidak akan pernah berjalan** tanpa error — silent bug.

```ts
// BENAR — v5 syntax
refetchInterval: (query) => query.state.data?.is_summarized === false ? 5000 : false
```

---

### BUG-3: `useModuleQuery.ts` — Query function tidak unwrap `APIResponse`

Contoh di ISSUE doc mengembalikan raw axios response, bukan data aktualnya:

```ts
// SALAH — data yang dikembalikan adalah AxiosResponse, bukan Module[]
queryFn: moduleService.getAll

// SALAH — sama, bukan ModuleDetail
queryFn: () => moduleService.getById(id)
```

Semua query function wajib unwrap dengan `.data.data`:

```ts
// BENAR
queryFn: async () => {
  const res = await moduleService.getAll()
  return res.data.data  // APIResponse<T>.data
}
```

> Ikuti pola yang sudah ada di `useModulesQuery` dan `useModuleDetailQuery` di repo, bukan contoh di ISSUE doc ini.

---

### BUG-4: Polling di halaman list tidak akan update status modul

Polling hanya didefinisikan di `useModuleDetailQuery`. Di halaman `/modules`, `ModuleCard` menampilkan status `is_summarized` dari **list query** (`useModulesQuery`). Ketika AI selesai memproses modul, list tidak akan ter-update karena list query tidak punya `refetchInterval`.

Tambahkan polling ke `useModulesQuery`:

```ts
refetchInterval: (query) =>
  query.state.data?.some(m => !m.is_summarized) ? 5000 : false
```

---

### BUG-5: `ModuleDetail.summary` bisa empty string saat `is_summarized = false`

Backend mengembalikan field `summary: string` pada `GET /modules/:id` bahkan saat modul masih diproses. Nilainya kemungkinan string kosong `""`. Jika `SummaryEditor` langsung menerima string kosong ini sebagai prop, textarea akan ter-render kosong tanpa indikasi bahwa modul masih diproses.

Guard ini wajib ditambahkan di halaman summary sebelum render `SummaryEditor`:

```ts
if (!module.is_summarized) {
  // tampilkan placeholder "sedang diproses", jangan render SummaryEditor
}
```

---

### BUG-6: File yang belum dibuat (akan crash saat diimport)

Item berikut disebut di ISSUE doc tapi belum ada filenya. Halaman yang mengimportnya akan langsung crash:

| File | Dibutuhkan oleh |
|---|---|
| `components/features/module/ModuleEmpty.tsx` | `/modules` page (empty state) |
| `components/features/module/SummaryEditor.tsx` | `/modules/:id/summary` page |
| `components/features/module/index.ts` | Semua halaman yang import dari `@/components/features/module` |

---

### BUG-7: `useToast` — import path barrel mungkin tidak re-export

`useToast` di-export dari `Toast.tsx` dan dikonsumsi lewat barrel `@/components/shared`. Pastikan barrel `src/components/shared/index.ts` sudah meng-export `useToast`. Jika hanya export `ToastProvider`, component yang memanggil `useToast()` akan throw error:

```
Error: useToast must be used within a ToastProvider
```

> Cek: `export * from './Toast'` di `src/components/shared/index.ts` sudah mencakup `useToast`.

---

## Definition of Done

- [ ] List modul dengan skeleton loading dan empty state
- [ ] ModuleCard dengan polling status is_summarized
- [ ] Hapus modul dengan Modal konfirmasi
- [ ] UploadForm dengan drag & drop + validasi client
- [ ] Detail modul dengan tombol aksi
- [ ] SummaryEditor dengan toggle view/edit mode
- [ ] Semua mutation dengan toast feedback
- [ ] Tidak ada error TypeScript
