# 📋 ISSUE: Frontend — Auth Case (Login, Register, Verify OTP, Update Email)

## Status
`open`

## Priority
`high`

## Assignee
_unassigned_

## Dependency
- `ISSUE_FRONTEND_SHARED.md` harus selesai terlebih dahulu (shared components tersedia)

---

## Background

Auth case mencakup semua alur autentikasi user: register, verifikasi OTP, login, logout, dan update email. Semua halaman auth menggunakan `AuthLayout` sebagai wrapper dan shared components dari `@/components/shared`.

--- Baca dokumentasi api lengkap nya di folder backend-pretest-ai/doc/user/swagger.yaml
---

## Struktur File yang Dikerjakan

```
src/
├── app/
│   └── (auth)/
│       ├── layout.tsx              ← pakai AuthLayout
│       ├── login/
│       │   └── page.tsx
│       ├── register/
│       │   └── page.tsx
│       └── verify-otp/
│           └── page.tsx
│
├── components/
│   ├── layouts/
│   │   └── Auth/
│   │       ├── Auth.tsx            ← AuthLayout component
│   │       └── index.ts
│   └── features/
│       └── auth/
│           ├── LoginForm.tsx
│           ├── RegisterForm.tsx
│           └── OTPForm.tsx
│
├── stores/
│   └── authStore.ts                ← Zustand: simpan token + user data
│
├── services/
│   └── authService.ts              ← axios call ke backend
│
├── queries/
│   └── useAuthQuery.ts             ← TanStack Query mutations
│
└── types/
    └── auth.types.ts               ← TypeScript interfaces
```

---

## Types (`src/types/auth.types.ts`)

Buat semua TypeScript interface yang dibutuhkan:

```ts
export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'member' | 'guest'
  is_verified: boolean
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface VerifyOTPRequest {
  email: string
  otp: string
}

export interface UpdateEmailRequest {
  new_email: string
}

export interface VerifyUpdateEmailRequest {
  new_email: string
  otp: string
}

export interface LoginResponse {
  token: string
  user: User
}
```

---

## Zustand Store (`src/stores/authStore.ts`)

```ts
interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean

  setAuth: (token: string, user: User) => void
  clearAuth: () => void
}
```

Gunakan `persist` middleware dari Zustand agar token tidak hilang saat refresh:

```ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setAuth: (token, user) => set({ token, user, isAuthenticated: true }),
      clearAuth: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    { name: 'auth-storage' }  // key di localStorage
  )
)
```

---

## Services (`src/services/authService.ts`)

```ts
// Semua function return Promise<APIResponse<T>>
// Axios instance sudah include token di header via interceptor (src/services/api.ts)

export const authService = {
  register: (data: RegisterRequest) =>
    api.post('/auth/register', data),

  verifyOTP: (data: VerifyOTPRequest) =>
    api.post('/auth/verify-otp', data),

  login: (data: LoginRequest) =>
    api.post<LoginResponse>('/auth/login', data),

  logout: () =>
    api.post('/auth/logout'),
}
```

Buat juga `src/services/api.ts` — Axios instance dengan interceptor:

```ts
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + '/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor — inject token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
```

---

## TanStack Query (`src/queries/useAuthQuery.ts`)

```ts
export function useLoginMutation() {
  const { setAuth } = useAuthStore()
  const { toast } = useToast()
  const router = useRouter()

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (res) => {
      setAuth(res.data.data.token, res.data.data.user)
      toast.success('Login berhasil!')
      router.push('/dashboard')
    },
    onError: (err) => {
      toast.error(err.response?.data?.error ?? 'Login gagal')
    },
  })
}

export function useRegisterMutation() { ... }
export function useVerifyOTPMutation() { ... }
export function useLogoutMutation() { ... }
```

---

## AuthLayout (`src/components/layouts/Auth/Auth.tsx`)

Layout wrapper untuk semua halaman auth. Tampilan: **split screen** — kiri branding, kanan form.

```
┌─────────────────────────────────────────┐
│          │                              │
│  Branding│         Form Area            │
│  & Quote │                              │
│  (hidden │   [Logo]                     │
│  mobile) │   [Title]                    │
│          │   [Subtitle]                 │
│          │                              │
│          │   {children}                 │
│          │                              │
└─────────────────────────────────────────┘
```

```ts
interface AuthLayoutProps {
  children: React.ReactNode
  title: string           // "Selamat Datang Kembali"
  subtitle: string        // "Masuk ke akun kamu untuk melanjutkan belajar"
}
```

**Kiri (hidden di mobile):**
- Background warna `primary`
- Logo / nama app "PreTest AI"
- Quote motivasi belajar
- Ilustrasi sederhana (opsional)

**Kanan:**
- Centered, max-width `sm`
- Logo kecil di atas (mobile only)
- `title` dan `subtitle`
- `{children}` — form

---

## Alur & Flow Setiap Halaman

### Alur 1 — Register (`/register`)

```
User isi form (name, email, password)
    └── Klik "Daftar"
            └── useRegisterMutation()
                    ├── Loading → Button disabled + Spinner
                    ├── Success → simpan email ke sessionStorage
                    │            redirect ke /verify-otp
                    └── Error   → toast.error(pesan dari backend)
```

**Validasi di form (sebelum hit API):**
- `name` — wajib, min 2 karakter
- `email` — wajib, format email valid
- `password` — wajib, min 8 karakter
- `confirmPassword` — harus sama dengan password (hanya di frontend, tidak dikirim ke backend)

**Komponen yang dipakai:**
```tsx
<AuthLayout title="Buat Akun Baru" subtitle="...">
  <RegisterForm />
</AuthLayout>
```

---

### Alur 2 — Verify OTP (`/verify-otp`)

```
User tiba dari /register (email tersimpan di sessionStorage)
    └── Tampilkan form OTP
            ├── 6 kotak input digit
            └── Klik "Verifikasi"
                    └── useVerifyOTPMutation()
                            ├── Loading → Button disabled
                            ├── Success → toast.success
                            │            redirect ke /login
                            └── Error   → toast.error "OTP salah"

Link "Kirim ulang OTP" → hit register ulang dengan email yang sama
Jika tidak ada email di sessionStorage → redirect ke /register
```

**Komponen yang dipakai:**
```tsx
<AuthLayout title="Verifikasi Email" subtitle="Masukkan kode OTP yang dikirim ke emailmu">
  <OTPForm />
</AuthLayout>
```

**Catatan OTPForm:**
- 6 kotak input terpisah, auto-focus ke kotak berikutnya saat angka diisi
- Auto-submit saat digit ke-6 terisi
- Paste support — tempel 6 digit langsung mengisi semua kotak

---

### Alur 3 — Login (`/login`)

```
User isi form (email, password)
    └── Klik "Masuk"
            └── useLoginMutation()
                    ├── Loading → Button disabled + Spinner
                    ├── Success → setAuth(token, user) ke Zustand
                    │            redirect ke /dashboard
                    └── Error 401 → toast.error "Email atau password salah"
                    └── Error 401 "email belum diverifikasi"
                                → toast.warning + link ke /verify-otp
```

**Validasi di form:**
- `email` — wajib, format email
- `password` — wajib

**Komponen yang dipakai:**
```tsx
<AuthLayout title="Selamat Datang" subtitle="Masuk ke akun kamu untuk melanjutkan belajar">
  <LoginForm />
</AuthLayout>
```

---

### Alur 4 — Logout

Logout tidak punya halaman tersendiri. Dipanggil dari Navbar/Sidebar:

```
Klik "Logout"
    └── Modal konfirmasi "Yakin ingin keluar?"
            └── Konfirmasi → useLogoutMutation()
                                ├── Hit POST /auth/logout
                                ├── clearAuth() dari Zustand
                                └── redirect ke /login
```

---

### Alur 5 — Update Email (halaman settings, bukan auth page)

Dua langkah — request OTP lalu verify. Ini ada di halaman **settings/profile** (bukan route auth), tapi querynya tetap di `useAuthQuery.ts`:

```
Step 1: User isi email baru → POST /user/email/request-update
    └── OTP dikirim ke email baru
    └── Tampilkan form OTP

Step 2: User isi OTP → POST /user/email/verify-update
    └── Email terupdate
    └── Update user di Zustand (email baru)
    └── toast.success
```

---

## Shared Components yang Dipakai

Pastikan semua komponen berikut sudah tersedia dari `ISSUE_FRONTEND_SHARED.md`:

| Component | Dipakai di |
|---|---|
| `Button` | Semua form (submit, loading state) |
| `Input` | LoginForm, RegisterForm |
| `Toast` | Semua mutation onSuccess/onError |
| `Spinner` | Di dalam Button saat loading |
| `Modal` | Konfirmasi logout |
| `Badge` | Status verified/unverified (opsional) |

---

## Route Protection

Buat middleware Next.js di `src/middleware.ts`:

```ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_ROUTES = ['/login', '/register', '/verify-otp']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const isPublic = PUBLIC_ROUTES.some(r => request.nextUrl.pathname.startsWith(r))

  // Belum login, akses halaman protected → redirect login
  if (!token && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Sudah login, akses halaman auth → redirect dashboard
  if (token && isPublic) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next|favicon.ico).*)'],
}
```

> **Catatan:** Zustand `persist` menyimpan token di `localStorage`. Untuk middleware Next.js (server-side), token perlu juga disimpan di **cookie** saat login agar middleware bisa membacanya. Tambahkan `document.cookie = \`token=${token}\`` saat `setAuth()` dipanggil.

---

## Environment Variable

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080
```

---

## Definition of Done

- [ ] `AuthLayout` selesai dengan tampilan split screen
- [ ] `LoginForm` — validasi + mutation + redirect
- [ ] `RegisterForm` — validasi + mutation + simpan email ke sessionStorage
- [ ] `OTPForm` — 6 kotak input, auto-focus, auto-submit, paste support
- [ ] `authStore` — persist token + user ke localStorage
- [ ] `authService` — semua endpoint auth
- [ ] `api.ts` — axios instance + request/response interceptor
- [ ] `useAuthQuery.ts` — semua mutation dengan onSuccess/onError
- [ ] Route protection via `middleware.ts`
- [ ] Token disimpan di cookie untuk middleware
- [ ] Tidak ada error TypeScript (`tsc --noEmit`)
- [ ] Semua alur di atas bisa dijalankan end-to-end
