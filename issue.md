# 📋 ISSUE: Frontend — Shared Components

## Status
`open`

## Priority
`high`

## Assignee
_unassigned_

---

## Background

Sebelum fitur apapun dikerjakan, tim perlu membangun **shared components** terlebih dahulu. Komponen ini akan dipakai di seluruh halaman aplikasi — auth, dashboard, modul, quiz, dll. Konsistensi visual dan API komponen sangat penting agar semua halaman terasa seragam.

Semua shared component berada di:
```
src/components/shared/
```

---

## Tech Stack

- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS** untuk styling
- Tidak ada UI library eksternal (MUI, shadcn, dll) — semua dibuat dari scratch

---

## Design System

Sebelum mulai kode, sepakati design token berikut di `tailwind.config.ts`:

```ts
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: '#4F46E5',  // indigo-600
        hover:   '#4338CA',  // indigo-700
        light:   '#EEF2FF',  // indigo-50
      },
      danger: {
        DEFAULT: '#EF4444',  // red-500
        hover:   '#DC2626',  // red-600
      },
      success: {
        DEFAULT: '#22C55E',  // green-500
      },
      warning: {
        DEFAULT: '#F59E0B',  // amber-500
      },
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
  },
}
```

---

## Struktur File

Tiap component punya folder sendiri dengan 2 file:

```
src/components/shared/
├── Button/
│   ├── Button.tsx      ← implementasi component
│   └── index.ts        ← re-export
├── Input/
│   ├── Input.tsx
│   └── index.ts
├── Textarea/
│   ├── Textarea.tsx
│   └── index.ts
├── Badge/
│   ├── Badge.tsx
│   └── index.ts
├── Card/
│   ├── Card.tsx
│   └── index.ts
├── Modal/
│   ├── Modal.tsx
│   └── index.ts
├── Spinner/
│   ├── Spinner.tsx
│   └── index.ts
├── Toast/
│   ├── Toast.tsx
│   └── index.ts
└── index.ts            ← re-export semua
```

Pattern `index.ts`:
```ts
// src/components/shared/Button/index.ts
export { Button } from './Button'

// src/components/shared/index.ts
export { Button } from './Button'
export { Input } from './Input'
// dst...
```

Sehingga import di seluruh project cukup:
```ts
import { Button, Input, Spinner } from '@/components/shared'
```

---

## 1. Button

**File:** `src/components/shared/Button/Button.tsx`

### Variant & Default Classes

| Variant | Default Classname |
|---|---|
| `primary` | `bg-primary text-white hover:bg-primary-hover` |
| `secondary` | `bg-white text-primary border border-primary hover:bg-primary-light` |
| `danger` | `bg-danger text-white hover:bg-danger-hover` |
| `ghost` | `bg-transparent text-primary hover:bg-primary-light` |

| Size | Default Classname |
|---|---|
| `sm` | `px-3 py-1.5 text-sm` |
| `md` | `px-4 py-2 text-sm` (default) |
| `lg` | `px-6 py-3 text-base` |

**Base classes (selalu ada):**
```
inline-flex items-center justify-center gap-2 rounded-lg font-medium
transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed
```

### Props Interface

```ts
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean       // tampilkan Spinner, disable button
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}
```

### Contoh Penggunaan

```tsx
<Button variant="primary" loading={isLoading}>Login</Button>
<Button variant="secondary" leftIcon={<UploadIcon />}>Upload PDF</Button>
<Button variant="danger" size="sm">Hapus</Button>
<Button variant="ghost">Batal</Button>
```

---

## 2. Input

**File:** `src/components/shared/Input/Input.tsx`

### Default Classes

**Container:** `flex flex-col gap-1`

**Label:** `text-sm font-medium text-gray-700`

**Input field:**
```
w-full px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white
placeholder:text-gray-400
focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
transition-colors duration-200
```

**State error:** ganti border menjadi `border-danger focus:ring-danger`

**Error message:** `text-xs text-danger mt-0.5`

**Helper text:** `text-xs text-gray-500 mt-0.5`

### Props Interface

```ts
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string          // pesan error, trigger state error
  helperText?: string     // teks bantuan di bawah input
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}
```

### Contoh Penggunaan

```tsx
<Input
  label="Email"
  type="email"
  placeholder="budi@example.com"
  error={errors.email?.message}
/>
<Input
  label="Password"
  type="password"
  rightIcon={<EyeIcon />}
  helperText="Minimal 8 karakter"
/>
```

---

## 3. Textarea

**File:** `src/components/shared/Textarea/Textarea.tsx`

### Default Classes

Sama dengan Input, dengan tambahan:

**Textarea field:**
```
w-full px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white
placeholder:text-gray-400 resize-none
focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
disabled:bg-gray-50 disabled:cursor-not-allowed
transition-colors duration-200
```

### Props Interface

```ts
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  rows?: number           // default: 4
}
```

### Contoh Penggunaan

```tsx
<Textarea
  label="Edit Summary"
  rows={8}
  placeholder="Tulis ringkasan modul..."
  error={errors.summary?.message}
/>
```

---

## 4. Badge

**File:** `src/components/shared/Badge/Badge.tsx`

### Variant & Default Classes

| Variant | Default Classname |
|---|---|
| `success` | `bg-green-100 text-green-700` |
| `warning` | `bg-amber-100 text-amber-700` |
| `danger` | `bg-red-100 text-red-700` |
| `info` | `bg-blue-100 text-blue-700` |
| `default` | `bg-gray-100 text-gray-600` |

**Base classes:**
```
inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium
```

### Props Interface

```ts
interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default'
  children: React.ReactNode
  dot?: boolean           // tampilkan dot indicator di kiri
}
```

### Contoh Penggunaan

```tsx
<Badge variant="success" dot>Verified</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="danger">Error</Badge>
<Badge variant="info">80 / 100</Badge>
```

---

## 5. Card

**File:** `src/components/shared/Card/Card.tsx`

### Default Classes

**Card wrapper:**
```
bg-white rounded-xl border border-gray-200 shadow-sm
```

**Sub-components:**

| Sub-component | Default Classname |
|---|---|
| `Card.Header` | `px-5 py-4 border-b border-gray-100` |
| `Card.Body` | `px-5 py-4` |
| `Card.Footer` | `px-5 py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl` |

### Props Interface

```ts
interface CardProps {
  children: React.ReactNode
  className?: string
  hoverable?: boolean     // tambah hover:shadow-md transition
}

// Sub-components (compound pattern)
Card.Header
Card.Body
Card.Footer
```

### Contoh Penggunaan

```tsx
<Card hoverable>
  <Card.Header>
    <h3>Pengantar Hukum Indonesia</h3>
  </Card.Header>
  <Card.Body>
    <p>Ringkasan modul...</p>
  </Card.Body>
  <Card.Footer>
    <Button size="sm">Buka Quiz</Button>
  </Card.Footer>
</Card>
```

---

## 6. Modal

**File:** `src/components/shared/Modal/Modal.tsx`

### Default Classes

**Overlay:** `fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4`

**Panel:**
```
bg-white rounded-xl shadow-xl w-full max-w-md
transform transition-all duration-200
```

| Size | Max Width |
|---|---|
| `sm` | `max-w-sm` |
| `md` | `max-w-md` (default) |
| `lg` | `max-w-lg` |
| `xl` | `max-w-xl` |

**Header:** `flex items-center justify-between px-6 py-4 border-b border-gray-100`

**Body:** `px-6 py-4`

**Footer:** `flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100`

### Props Interface

```ts
interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  children: React.ReactNode
  footer?: React.ReactNode
  closeOnOverlayClick?: boolean   // default: true
}
```

### Contoh Penggunaan

```tsx
<Modal
  open={isOpen}
  onClose={() => setIsOpen(false)}
  title="Konfirmasi Hapus"
  footer={
    <>
      <Button variant="ghost" onClick={() => setIsOpen(false)}>Batal</Button>
      <Button variant="danger" loading={isDeleting}>Hapus</Button>
    </>
  }
>
  <p>Apakah kamu yakin ingin menghapus modul ini?</p>
</Modal>
```

---

## 7. Spinner

**File:** `src/components/shared/Spinner/Spinner.tsx`

### Default Classes

```
animate-spin rounded-full border-2 border-gray-200 border-t-primary
```

| Size | Classname |
|---|---|
| `sm` | `w-4 h-4` |
| `md` | `w-6 h-6` (default) |
| `lg` | `w-8 h-8` |

### Props Interface

```ts
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}
```

### Contoh Penggunaan

```tsx
<Spinner />
<Spinner size="lg" />

{/* Di dalam Button */}
{loading && <Spinner size="sm" />}
```

---

## 8. Toast

**File:** `src/components/shared/Toast/Toast.tsx`

Gunakan pattern **context + hook** agar bisa dipanggil dari mana saja.

### Default Classes

**Container (fixed):** `fixed bottom-4 right-4 z-50 flex flex-col gap-2`

**Toast item:**
```
flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg
min-w-[280px] max-w-sm text-sm font-medium
animate-in slide-in-from-right-5 duration-300
```

| Variant | Classname |
|---|---|
| `success` | `bg-green-600 text-white` |
| `error` | `bg-red-600 text-white` |
| `warning` | `bg-amber-500 text-white` |
| `info` | `bg-blue-600 text-white` |

### Interface & Hook

```ts
interface ToastOptions {
  message: string
  variant?: 'success' | 'error' | 'warning' | 'info'
  duration?: number     // ms, default: 3000
}

// Hook untuk trigger toast
const { toast } = useToast()

toast.success('Login berhasil!')
toast.error('Gagal upload file')
toast.warning('Summary belum tersedia')
toast.info('Quiz sedang diproses...')
```

### Setup di Root Layout

```tsx
// src/app/layout.tsx
<ToastProvider>
  {children}
</ToastProvider>
```

---

## Utility: `cn()` helper

Buat helper `cn()` di `src/lib/utils.ts` untuk merge Tailwind classes dengan aman:

```ts
// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

Install dependency:
```bash
npm install clsx tailwind-merge
```

Penggunaan di semua komponen:
```tsx
// Contoh di Button
className={cn(
  'inline-flex items-center justify-center rounded-lg font-medium',
  variant === 'primary' && 'bg-primary text-white hover:bg-primary-hover',
  variant === 'danger'  && 'bg-danger text-white hover:bg-danger-hover',
  size === 'sm' && 'px-3 py-1.5 text-sm',
  size === 'lg' && 'px-6 py-3 text-base',
  className   // allow override dari luar
)}
```

---

## Dependencies yang Dibutuhkan

```bash
npm install clsx tailwind-merge
```

Sudah termasuk di project (tidak perlu install tambahan):
- `tailwindcss` — styling
- `typescript` — type safety
- `react` — hooks (useState, useContext, useRef)

---

## Konvensi Penting

- Semua komponen **harus** menerima `className?: string` untuk allow override dari luar
- Gunakan `cn()` untuk merge classes, jangan string concatenation manual
- Semua props **extend** HTML element aslinya (misal `ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>`) agar semua HTML attribute tetap bisa dipakai
- Tidak ada hardcoded warna di luar Tailwind config — semua pakai design token
- Setiap komponen harus bisa berdiri sendiri — tidak boleh import dari komponen shared lain kecuali `Spinner` boleh dipakai di `Button`
- jangan ubah/remove existing file/folder yang lain diluar task

---

## Urutan Pengerjaan yang Disarankan

1. Setup `tailwind.config.ts` dengan design tokens
2. Buat `src/lib/utils.ts` dengan `cn()`
3. `Spinner` — paling simple, tidak ada dependency
4. `Button` — pakai Spinner di dalamnya
5. `Input`, `Textarea` — pattern sama
6. `Badge` — simple
7. `Card` — compound component pattern
8. `Modal` — butuh state management
9. `Toast` — paling complex (context + hook)
10. Buat `src/components/shared/index.ts` — re-export semua

---

## Definition of Done

- [ ] Semua 8 komponen selesai dibuat sesuai spec
- [ ] `src/components/shared/index.ts` sudah re-export semua
- [ ] Semua komponen menerima `className` prop untuk override
- [ ] `cn()` utility dipakai di semua komponen
- [ ] Tidak ada error TypeScript (`tsc --noEmit`)
- [ ] Semua komponen bisa diimport dengan `import { X } from '@/components/shared'`
