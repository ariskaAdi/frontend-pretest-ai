# ISSUE: Frontend — Dashboard Layout

## Status
`open`

## Priority
`high`

## Assignee
_unassigned_

## Dependency
- `ISSUE_FRONTEND_SHARED.md` harus selesai (shared components tersedia)
- `ISSUE_FRONTEND_AUTH.md` harus selesai (auth + authStore tersedia)

---

## Background

Dashboard layout adalah wrapper untuk semua halaman yang membutuhkan autentikasi. Layout ini terdiri dari **Sidebar** (desktop) dan **Navbar** dengan hamburger menu (mobile). Semua halaman di dalam `src/app/(dashboard)/` menggunakan layout ini.

---

## Struktur File

```
src/
├── app/
│   └── (dashboard)/
│       ├── layout.tsx              ← pakai DashboardLayout
│       └── dashboard/
│           └── page.tsx            ← halaman dashboard utama
│
├── components/
│   ├── layouts/
│   │   └── Dashboard/
│   │       ├── Dashboard.tsx       ← DashboardLayout wrapper
│   │       ├── Sidebar.tsx         ← navigasi kiri (desktop)
│   │       ├── Navbar.tsx          ← top bar (mobile + desktop)
│   │       ├── MobileMenu.tsx      ← drawer menu mobile
│   │       └── index.ts
│   └── features/
│       └── dashboard/
│           ├── StatCard.tsx        ← card statistik ringkas
│           └── WelcomeBanner.tsx   ← banner sambutan + nama user
│
├── services/
│   └── userService.ts              ← GET /user/me
│
├── queries/
│   └── useUserQuery.ts             ← useGetMeQuery hook
│
└── constants/
    └── routes.ts                   ← konstanta semua path navigasi
```

---

## Layout Structure

### Desktop (≥ lg)

```
┌──────────┬────────────────────────────────┐
│          │  Navbar (top)                  │
│ Sidebar  ├────────────────────────────────┤
│  (fixed) │                                │
│          │   {children}                   │
│  240px   │   (main content area)          │
│          │                                │
└──────────┴────────────────────────────────┘
```

### Mobile (< lg)

```
┌────────────────────────────────────────┐
│  Navbar (hamburger | logo | user)      │
├────────────────────────────────────────┤
│                                        │
│   {children}                           │
│                                        │
└────────────────────────────────────────┘
↓ Hamburger diklik
┌──────────┬─────────────────────────────┐
│ Drawer   │  overlay (klik tutup)       │
│ (slide   │                             │
│  from    │                             │
│  left)   │                             │
└──────────┴─────────────────────────────┘
```

---

## Sidebar (`Sidebar.tsx`)

### Default Classes

**Wrapper:**
```
fixed left-0 top-0 h-full w-60 bg-white border-r border-gray-200
flex flex-col z-30
```

**Logo area:** `px-5 py-5 border-b border-gray-100`

**Nav section:** `flex-1 overflow-y-auto px-3 py-4`

**Nav item (default):**
```
flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
text-gray-600 hover:bg-gray-100 hover:text-gray-900
transition-colors duration-150 cursor-pointer
```

**Nav item (active):**
```
bg-primary-light text-primary
```

**User section (bottom):** `px-4 py-4 border-t border-gray-100`

### Navigation Items

```ts
const navItems = [
  { label: 'Dashboard',  href: '/dashboard',  icon: HomeIcon },
  { label: 'Modul',      href: '/modules',    icon: BookOpenIcon },
  { label: 'Quiz',       href: '/quiz',        icon: ClipboardIcon },
]
```

Gunakan `usePathname()` dari Next.js untuk deteksi route aktif.

---

## Navbar (`Navbar.tsx`)

### Default Classes

**Wrapper:**
```
fixed top-0 right-0 left-0 lg:left-60 h-16 bg-white border-b border-gray-200
flex items-center justify-between px-4 lg:px-6 z-20
```

**Kiri:** hamburger button (mobile only) + breadcrumb / page title

**Kanan:** nama user + avatar + dropdown (logout)

### User Dropdown

Klik avatar/nama → dropdown muncul:
```
┌─────────────────┐
│ Budi Santoso    │
│ budi@gmail.com  │
├─────────────────┤
│ 👤 Profile      │
│ 🚪 Logout       │
└─────────────────┘
```

Logout → trigger Modal konfirmasi → `useLogoutMutation()`

---

## DashboardLayout (`Dashboard.tsx`)

```ts
interface DashboardLayoutProps {
  children: React.ReactNode
}
```

Yang dikelola layout ini:
- Render `Sidebar` (desktop)
- Render `Navbar` (selalu)
- Render `MobileMenu` drawer
- State `isMobileMenuOpen` — buka/tutup drawer
- Main content area dengan padding yang menyesuaikan sidebar

```tsx
// src/app/(dashboard)/layout.tsx
import { DashboardLayout } from '@/components/layouts/Dashboard'

export default function Layout({ children }) {
  return <DashboardLayout>{children}</DashboardLayout>
}
```

---

## Halaman Dashboard (`/dashboard`)

Halaman ringkasan — tampilkan statistik singkat user.

### Data yang Ditampilkan

Ambil dari masing-masing query:
- Jumlah modul yang dimiliki → `useModuleQuery`
- Jumlah quiz yang sudah dikerjakan → `useQuizQuery`
- Rata-rata skor quiz → hitung dari history

### Layout Halaman

```
┌─────────────────────────────────────────────┐
│  WelcomeBanner: "Halo, Budi! 👋"            │
│  "Semangat belajar hari ini"                 │
├──────────┬──────────┬──────────┬────────────┤
│  Total   │  Quiz    │ Rata-rata│  Modul     │
│  Modul   │ Selesai  │  Skor    │  Pending   │
│    3     │    5     │   72%    │    1       │
├──────────┴──────────┴──────────┴────────────┤
│  Modul Terbaru (list 3 modul terakhir)       │
├─────────────────────────────────────────────┤
│  Quiz Terakhir (list 3 quiz terakhir)        │
└─────────────────────────────────────────────┘
```

### StatCard (`StatCard.tsx`)

```ts
interface StatCardProps {
  label: string
  value: string | number
  icon: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'info'
}
```

---

## API Integration — `GET /user/me`

### Endpoint

```
GET /api/v1/user/me
Authorization: Bearer <token>
```

Response menggunakan schema `LoginResponse`:

```ts
{
  token: string
  user: {
    id: string
    name: string
    email: string
    role: string
    is_verified: boolean
  }
}
```

### `userService.ts`

```ts
// src/services/userService.ts
import api from './api'
import type { APIResponse } from '@/types/api.types'
import type { LoginResponse } from '@/types/auth.types'

export const userService = {
  getMe: () => api.get<APIResponse<LoginResponse>>('/user/me'),
}
```

### `useGetMeQuery` (`useUserQuery.ts`)

```ts
// src/queries/useUserQuery.ts
'use client'

import { useQuery } from '@tanstack/react-query'
import { userService } from '@/services/userService'
import { useAuthStore } from '@/stores/authStore'

export function useGetMeQuery() {
  const { isAuthenticated } = useAuthStore()

  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: async () => {
      const res = await userService.getMe()
      return res.data.data.user
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 menit
  })
}
```

### Penggunaan di `WelcomeBanner.tsx`

Ambil nama user dari `useGetMeQuery`, bukan dari `authStore`:

```tsx
const { data: user } = useGetMeQuery()
// tampilkan user.name di banner
```

### Penggunaan di `Navbar.tsx`

```tsx
const { data: user } = useGetMeQuery()
// tampilkan user.name dan user.email di dropdown
```

---

## Route Protection di Layout

Cek `isAuthenticated` dari `useAuthStore`. Jika false → redirect `/login`:

```tsx
// Di DashboardLayout
const { isAuthenticated } = useAuthStore()
const router = useRouter()

useEffect(() => {
  if (!isAuthenticated) router.push('/login')
}, [isAuthenticated])
```

---

## Shared Components yang Dipakai

| Component | Dipakai di |
|---|---|
| `Button` | Navbar dropdown, logout |
| `Modal` | Konfirmasi logout |
| `Spinner` | Loading state halaman |
| `Badge` | Status modul/quiz |
| `Card` | StatCard, modul terbaru |
| `Toast` | Notifikasi logout |

---

## Definition of Done

- [ ] `DashboardLayout` selesai — sidebar + navbar + main content
- [ ] `Sidebar` — nav items, active state, logo
- [ ] `Navbar` — user dropdown (nama + email dari `useGetMeQuery`), hamburger (mobile)
- [ ] `MobileMenu` — drawer slide dari kiri
- [ ] Halaman `/dashboard` — WelcomeBanner + 4 StatCard + list terbaru
- [ ] `userService.getMe()` — memanggil `GET /api/v1/user/me` dengan Bearer token
- [ ] `useGetMeQuery` — query hook dengan `enabled: isAuthenticated` dan `staleTime: 5 menit`
- [ ] `WelcomeBanner` — menampilkan nama user dari `useGetMeQuery`
- [ ] Responsive — desktop sidebar fixed, mobile drawer
- [ ] Logout dari dropdown berfungsi dengan Modal konfirmasi
- [ ] Route protection — redirect ke `/login` jika belum auth
- [ ] Tidak ada error TypeScript
