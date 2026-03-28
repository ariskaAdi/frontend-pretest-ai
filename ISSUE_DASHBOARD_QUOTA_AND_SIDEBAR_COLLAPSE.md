# ISSUE: Dashboard Quota Display & Collapsible Sidebar

## Status
`open`

## Priority
`high`

## Assignee
_unassigned_

---

## Background

Backend baru saja mengimplementasikan sistem quota berbasis role:
- User baru (`guest`) mendapat **1 quiz quota + 1 summarize quota** saat registrasi
- User yang beli paket di Lynk.id (`member`) mendapat quota sesuai paket yang dibeli
- Quota bersifat accumulate

Frontend perlu merefleksikan perubahan ini agar user tahu berapa sisa quota mereka, sekaligus memperbaiki UX sidebar yang saat ini tidak bisa diperkecil.

---

## Gambaran Perubahan

### 1. Dashboard — Ganti "Target: 3 Modul/Minggu" → Info Quota
Di `WelcomeBanner`, badge hardcoded `"Target: 3 Modul/Minggu"` tidak relevan lagi. Ganti dengan badge yang menampilkan sisa **quiz quota** dan **summarize quota** secara real-time dari data user.

### 2. Dashboard — Tambah StatCard Quota
Tambahkan 2 StatCard baru di grid stats: **"Quiz Tersisa"** dan **"Ringkas Tersisa"**, lengkap dengan indikator visual jika quota hampir habis.

### 3. Sidebar — Collapsible (desktop only)
Sidebar desktop saat ini fixed `w-60` tanpa bisa diperkecil. Tambahkan toggle button agar sidebar bisa collapse menjadi hanya icon (`w-16`), dan state-nya persist di localStorage agar tidak reset saat navigasi.

---

## Task 1 — Update Type `User` dengan Field Quota

### File: `src/types/auth.types.ts`

Tambahkan field `quiz_quota` dan `summarize_quota` ke interface `User`:

```ts
export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'member' | 'guest'
  is_verified: boolean
  quiz_quota: number      // ← TAMBAH
  summarize_quota: number // ← TAMBAH
}
```

> Kedua field ini sudah dikirim dari endpoint `GET /api/v1/users/me` setelah backend diupdate.

---

## Task 2 — Update `WelcomeBanner`: Ganti Badge Hardcoded → Badge Quota

### File: `src/components/features/dashboard/WelcomeBanner.tsx`

#### Kondisi Saat Ini

```tsx
<div className="bg-white/10 ...">
  <svg ... /> {/* trophy icon */}
  <span className="text-sm font-semibold text-white">Target: 3 Modul/Minggu</span>
</div>
```

Badge ini hardcoded dan tidak informatif. Ganti dengan dua badge dinamis yang menampilkan sisa quota.

#### Yang Harus Dilakukan

Ganti satu badge `"Target: 3 Modul/Minggu"` menjadi **dua badge** quota:

```tsx
{/* Badge: Sisa Quiz Quota */}
<div className="bg-white/10 backdrop-blur-md rounded-full px-4 py-1.5 flex items-center gap-2 border border-white/10 hover:bg-white/20 transition-colors">
  <svg ... /> {/* icon clipboard/quiz */}
  <span className="text-sm font-semibold text-white">
    Quiz: {user.quiz_quota} tersisa
  </span>
</div>

{/* Badge: Sisa Summarize Quota */}
<div className="bg-white/10 backdrop-blur-md rounded-full px-4 py-1.5 flex items-center gap-2 border border-white/10 hover:bg-white/20 transition-colors">
  <svg ... /> {/* icon file-text/summarize */}
  <span className="text-sm font-semibold text-white">
    Ringkas: {user.summarize_quota} tersisa
  </span>
</div>
```

#### Logika Warna Badge

Berikan visual warning jika quota sudah habis:

| Kondisi | Style badge |
|---|---|
| quota > 0 | `bg-white/10` (normal, putih transparan) |
| quota === 0 | `bg-danger/30 border-danger/40` (merah transparan) |

Contoh implementasi kondisional:

```tsx
const quizBadgeStyle = user.quiz_quota === 0
  ? "bg-red-500/30 border-red-400/40"
  : "bg-white/10 border-white/10"

const summarizeBadgeStyle = user.summarize_quota === 0
  ? "bg-red-500/30 border-red-400/40"
  : "bg-white/10 border-white/10"
```

#### Jika Quota Habis — Tampilkan Tombol Beli

Jika `quiz_quota === 0` atau `summarize_quota === 0`, tampilkan tombol "Beli Quota" di sebelah kanan banner (gantikan atau sejajarkan dengan tombol "Mulai Belajar"):

```tsx
{(user.quiz_quota === 0 || user.summarize_quota === 0) && (
  <a
    href="https://lynk.id/..." // URL produk Lynk — isi sesuai URL aktual
    target="_blank"
    rel="noopener noreferrer"
    className="bg-warning text-white font-bold px-6 py-3 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
  >
    Beli Quota
  </a>
)}
```

> ⚠️ URL Lynk.id perlu diisi sesuai link produk aktual. Simpan di environment variable atau konstanta:
> bagian ini skip saja karena aku yang akan mengurusnya
> ```ts
> // src/lib/constants.ts
<!-- > export const LYNK_STORE_URL = process.env.NEXT_PUBLIC_LYNK_STORE_URL ?? '' -->
> ```

---

## Task 3 — Update Dashboard Page: Tambah StatCard Quota

### File: `src/app/(dashboard)/dashboard/page.tsx`

#### Yang Harus Dilakukan

Tambahkan `useGetMeQuery` dan sisipkan 2 StatCard baru untuk quota di grid stats. Grid saat ini `lg:grid-cols-4` akan tetap 4 kolom, **ganti 2 StatCard lama** atau **perluas grid** sesuai desain.

**Rekomendasi: ganti "Modul Pending" dan tambah quota** sehingga tetap 4 card:

| Card | Ganti / Tetap |
|---|---|
| Total Modul | Tetap |
| Quiz Selesai | Tetap |
| Rata-rata Skor | Tetap |
| Modul Pending | **Ganti** → Quiz Tersisa |

Atau jadikan 6 card dengan `lg:grid-cols-3 xl:grid-cols-6` — diskusikan dengan desainer.

Tambahkan data quota ke `stats`:

```tsx
const { data: user } = useGetMeQuery()

// Tambahkan ke array stats:
{
  label: 'Quiz Tersisa',
  value: user?.quiz_quota ?? '-',
  icon: <Clipboard size={20} />,
  variant: (user?.quiz_quota ?? 1) === 0 ? 'danger' as const : 'success' as const,
  description: user?.quiz_quota === 0 ? 'Quota habis — beli paket' : 'Generate quiz tersedia'
},
{
  label: 'Ringkas Tersisa',
  value: user?.summarize_quota ?? '-',
  icon: <FileText size={20} />,
  variant: (user?.summarize_quota ?? 1) === 0 ? 'danger' as const : 'info' as const,
  description: user?.summarize_quota === 0 ? 'Quota habis — beli paket' : 'Summarize AI tersedia'
},
```

Tambahkan `'danger'` ke `StatCard` variant jika belum ada (lihat Task 3b).

#### Task 3b — Update `StatCard` Tambah Variant `danger`

### File: `src/components/features/dashboard/StatCard.tsx`

Tambahkan variant `danger` ke `variantStyles`:

```tsx
const variantStyles = {
  default: 'text-primary bg-primary-light',
  success: 'text-success bg-success/10',
  warning: 'text-warning bg-warning/10',
  info: 'text-blue-600 bg-blue-50',
  danger: 'text-red-600 bg-red-50',  // ← TAMBAH
}
```

Update interface:

```tsx
interface StatCardProps {
  variant?: 'default' | 'success' | 'warning' | 'info' | 'danger' // ← tambah 'danger'
  // ...
}
```

---

## Task 4 — Sidebar Collapsible (Desktop)

Ini task terbesar. Sidebar collapse melibatkan 4 file karena sidebar, layout, dan navbar harus sinkron lebarnya.

### Arsitektur State

State collapsed sidebar perlu **dibagi** antara `Sidebar`, `DashboardLayout`, dan `Navbar` (karena ketiganya bergantung pada lebar sidebar):

- `Sidebar` → menampilkan toggle button, mengubah tampilannya sendiri
- `DashboardLayout` → mengatur `pl-60` atau `pl-16`
- `Navbar` → mengatur `left-60` atau `left-16`

**Solusi: Gunakan Zustand store baru** (konsisten dengan pola yang sudah ada di `authStore`).

---

### Task 4a — Buat `useSidebarStore`

### File baru: `src/stores/sidebarStore.ts`

```ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SidebarStore {
  isCollapsed: boolean
  toggle: () => void
  setCollapsed: (val: boolean) => void
}

export const useSidebarStore = create<SidebarStore>()(
  persist(
    (set) => ({
      isCollapsed: false,
      toggle: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
      setCollapsed: (val) => set({ isCollapsed: val }),
    }),
    {
      name: 'sidebar-state', // key di localStorage
    }
  )
)
```

> `persist` dari Zustand akan otomatis menyimpan ke `localStorage` sehingga state tidak reset saat navigasi atau refresh.

---

### Task 4b — Update `Sidebar.tsx`

### File: `src/components/layouts/Sidebar/Sidebar.tsx`

#### Perubahan:
1. Baca `isCollapsed` dan `toggle` dari `useSidebarStore`
2. Ubah lebar sidebar secara kondisional: `w-60` vs `w-16`
3. Sembunyikan label teks saat collapsed, hanya tampilkan icon
4. Tambahkan tooltip saat collapsed agar user tahu nama menu
5. Tambahkan toggle button di area logo

```tsx
'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useSidebarStore } from '@/stores/sidebarStore'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'

// navItems tetap sama...

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname()
  const { isCollapsed, toggle } = useSidebarStore()

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-full bg-white border-r border-gray-200 flex flex-col z-30 transition-all duration-300 ease-in-out",
      isCollapsed ? "w-16" : "w-60",
      className
    )}>
      {/* Logo Area + Toggle Button */}
      <div className="px-3 py-5 border-b border-gray-100 flex items-center justify-between">
        {/* Logo: sembunyikan teks saat collapsed */}
        <div className={cn("flex items-center gap-2 overflow-hidden", isCollapsed && "justify-center w-full")}>
          <div className="w-8 h-8 shrink-0 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
            P
          </div>
          {!isCollapsed && (
            <span className="text-lg font-bold text-gray-900 whitespace-nowrap">Pretest AI</span>
          )}
        </div>

        {/* Toggle button: hanya muncul saat expanded */}
        {!isCollapsed && (
          <button
            onClick={toggle}
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors shrink-0"
            aria-label="Collapse sidebar"
          >
            <PanelLeftClose size={18} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-6 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.label : undefined} // tooltip saat collapsed
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 cursor-pointer",
                isCollapsed && "justify-center px-0",
                isActive
                  ? "bg-primary-light text-primary"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              {item.icon}
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer: tombol expand saat collapsed, versi saat expanded */}
      <div className="px-2 py-4 border-t border-gray-100 mt-auto">
        {isCollapsed ? (
          <button
            onClick={toggle}
            className="w-full flex justify-center p-2 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Expand sidebar"
          >
            <PanelLeftOpen size={18} />
          </button>
        ) : (
          <p className="text-xs text-center text-gray-400">© 2024 Pretest AI v0.1.0</p>
        )}
      </div>
    </aside>
  )
}
```

---

### Task 4c — Update `DashboardLayout.tsx`

### File: `src/components/layouts/Dashboard/Dashboard.tsx`

Ganti `lg:pl-60` hardcoded menjadi dinamis berdasarkan `isCollapsed`:

```tsx
import { useSidebarStore } from '@/stores/sidebarStore'

export function DashboardLayout({ children }: DashboardLayoutProps) {
  // ... kode yang ada ...
  const { isCollapsed } = useSidebarStore()

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar className="hidden lg:flex" />

      {/* Ganti lg:pl-60 → dinamis */}
      <div className={cn(
        "flex flex-col min-h-screen transition-all duration-300 ease-in-out",
        isCollapsed ? "lg:pl-16" : "lg:pl-60"
      )}>
        <Navbar ... />
        <MobileMenu ... />
        <main className="flex-1 pt-24 px-4 pb-12 lg:px-8">
          <div className="mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
```

---

### Task 4d — Update `Navbar.tsx`

### File: `src/components/layouts/Navbar/Navbar.tsx`

Ganti `lg:left-60` hardcoded menjadi dinamis:

```tsx
import { useSidebarStore } from '@/stores/sidebarStore'
import { cn } from '@/lib/utils'

export function Navbar({ ... }: NavbarProps) {
  const { isCollapsed } = useSidebarStore()
  // ... kode yang ada ...

  return (
    <>
      <header className={cn(
        "fixed top-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 z-20 transition-all duration-300 ease-in-out",
        // Ganti lg:left-60 hardcoded:
        isCollapsed ? "left-0 lg:left-16" : "left-0 lg:left-60"
      )}>
        {/* konten navbar tetap sama */}
      </header>
    </>
  )
}
```

---

## Ringkasan Perubahan Per File

| File | Perubahan |
|---|---|
| `src/types/auth.types.ts` | Tambah `quiz_quota` dan `summarize_quota` ke interface `User` |
| `src/components/features/dashboard/WelcomeBanner.tsx` | Ganti badge hardcoded → 2 badge quota dinamis + tombol beli jika quota habis |
| `src/components/features/dashboard/StatCard.tsx` | Tambah variant `'danger'` |
| `src/app/(dashboard)/dashboard/page.tsx` | Tambah `useGetMeQuery`, tambah StatCard quota ke grid |
| `src/stores/sidebarStore.ts` | **File baru** — Zustand store untuk sidebar collapse state (dengan persist) |
| `src/components/layouts/Sidebar/Sidebar.tsx` | Collapsible sidebar: lebar dinamis, sembunyikan label, toggle button |
| `src/components/layouts/Dashboard/Dashboard.tsx` | `lg:pl-60` → dinamis berdasarkan `isCollapsed` |
| `src/components/layouts/Navbar/Navbar.tsx` | `lg:left-60` → dinamis berdasarkan `isCollapsed` |

---

## Catatan Penting untuk Implementasi

### Quota Display untuk Role Admin
User dengan `role === 'admin'` tidak punya batasan quota. Untuk admin, jangan tampilkan badge quota — ganti dengan badge "Admin Access":

```tsx
// Di WelcomeBanner dan StatCard
if (user.role === 'admin') {
  // Tampilkan badge "Admin — Unlimited" atau skip StatCard quota
}
```

### URL Lynk Store (skip)
URL toko Lynk belum ada di codebase. Perlu ditambahkan ke `.env.local`: ?// bagian ini skip dulu
```
NEXT_PUBLIC_LYNK_STORE_URL=https://lynk.id/...
```
Minta URL ini dari product owner sebelum deploy.

### Sidebar Mobile
Collapsible sidebar **hanya untuk desktop** (`lg:` breakpoint). Sidebar mobile via `MobileMenu` (drawer) **tidak berubah** dalam issue ini.

### Transition Duration
Gunakan `transition-all duration-300 ease-in-out` konsisten di semua elemen yang terpengaruh collapse (sidebar, padding layout, left navbar) agar animasinya mulus dan tidak patah-patah.

---

## Definition of Done

- [ ] `User` type memiliki field `quiz_quota` dan `summarize_quota`
- [ ] `WelcomeBanner` menampilkan sisa quiz quota dan summarize quota secara dinamis (bukan hardcoded)
- [ ] Badge quota di WelcomeBanner berwarna merah jika quota = 0
- [ ] Tombol "Beli Quota" muncul di banner jika salah satu quota = 0
- [ ] StatCard quota ditampilkan di dashboard grid
- [ ] `StatCard` mendukung variant `danger`
- [ ] Admin tidak melihat badge/card quota (tampilkan "Unlimited" atau disembunyikan)
- [ ] Sidebar desktop bisa collapse menjadi icon-only dengan toggle button
- [ ] State collapse tersimpan di localStorage (tidak reset saat navigasi/refresh)
- [ ] Animasi transisi mulus saat expand/collapse
- [ ] Navbar dan content area ikut menyesuaikan lebar saat sidebar collapse
- [ ] Sidebar mobile (MobileMenu drawer) tidak terpengaruh
- [ ] Gunakan shared component agar reusable
