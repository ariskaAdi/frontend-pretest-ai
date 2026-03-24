'use client'

import * as React from 'react'
import Link from 'next/link'
import { Input, Button } from '@/components/shared'
import { useRegisterMutation } from '@/queries/useAuthQuery'

export function RegisterForm() {
  const [form, setForm] = React.useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = React.useState<Partial<typeof form>>({})
  const [showPassword, setShowPassword] = React.useState(false)

  const registerMutation = useRegisterMutation()

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const validate = () => {
    const errs: Partial<typeof form> = {}
    if (!form.name || form.name.trim().length < 2) errs.name = 'Nama minimal 2 karakter'
    if (!form.email) errs.email = 'Email wajib diisi'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Format email tidak valid'
    if (!form.password || form.password.length < 8) errs.password = 'Password minimal 8 karakter'
    if (!form.confirmPassword) errs.confirmPassword = 'Konfirmasi password wajib diisi'
    else if (form.confirmPassword !== form.password) errs.confirmPassword = 'Password tidak cocok'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validate()) return
    registerMutation.mutate({ name: form.name.trim(), email: form.email, password: form.password })
  }

  const EyeIcon = ({ visible }: { visible: boolean }) => (
    <button type="button" onClick={() => setShowPassword(!visible)} tabIndex={-1}>
      {visible ? (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )}
    </button>
  )

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Nama Lengkap"
        type="text"
        placeholder="Budi Santoso"
        value={form.name}
        onChange={set('name')}
        error={errors.name}
        autoComplete="name"
      />
      <Input
        label="Email"
        type="email"
        placeholder="budi@example.com"
        value={form.email}
        onChange={set('email')}
        error={errors.email}
        autoComplete="email"
      />
      <Input
        label="Password"
        type={showPassword ? 'text' : 'password'}
        placeholder="Minimal 8 karakter"
        value={form.password}
        onChange={set('password')}
        error={errors.password}
        helperText={!errors.password ? 'Minimal 8 karakter' : undefined}
        autoComplete="new-password"
        rightIcon={<EyeIcon visible={showPassword} />}
      />
      <Input
        label="Konfirmasi Password"
        type={showPassword ? 'text' : 'password'}
        placeholder="Ulangi password"
        value={form.confirmPassword}
        onChange={set('confirmPassword')}
        error={errors.confirmPassword}
        autoComplete="new-password"
      />
      <Button
        type="submit"
        variant="primary"
        loading={registerMutation.isPending}
        className="w-full mt-2"
      >
        Daftar
      </Button>
      <p className="text-center text-sm text-gray-600">
        Sudah punya akun?{' '}
        <Link href="/login" className="text-primary font-medium hover:underline">
          Masuk sekarang
        </Link>
      </p>
    </form>
  )
}
