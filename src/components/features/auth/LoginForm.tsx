'use client'

import * as React from 'react'
import Link from 'next/link'
import { Input, Button } from '@/components/shared'
import { useLoginMutation } from '@/queries/useAuthQuery'

export function LoginForm() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)
  const [errors, setErrors] = React.useState<{ email?: string; password?: string }>({})

  const loginMutation = useLoginMutation()

  const validate = () => {
    const errs: typeof errors = {}
    if (!email) errs.email = 'Email wajib diisi'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Format email tidak valid'
    if (!password) errs.password = 'Password wajib diisi'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validate()) return
    loginMutation.mutate({ email, password })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Email"
        type="email"
        placeholder="budi@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        autoComplete="email"
      />
      <Input
        label="Password"
        type={showPassword ? 'text' : 'password'}
        placeholder="Masukkan password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        autoComplete="current-password"
        rightIcon={
          <button type="button" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
            {showPassword ? (
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
        }
      />
      <Button
        type="submit"
        variant="primary"
        loading={loginMutation.isPending}
        className="w-full mt-2"
      >
        Masuk
      </Button>
      <p className="text-center text-sm text-gray-600">
        Belum punya akun?{' '}
        <Link href="/register" className="text-primary font-medium hover:underline">
          Daftar sekarang
        </Link>
      </p>
    </form>
  )
}
