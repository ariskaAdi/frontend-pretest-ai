'use client'

import * as React from 'react'
import Link from 'next/link'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input, Button } from '@/components/shared'
import { useRegisterMutation } from '@/queries/useAuthQuery'

const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Nama wajib diisi')
      .min(2, 'Nama minimal 2 karakter')
      .transform((v) => v.trim()),
    email: z
      .string()
      .min(1, 'Email wajib diisi')
      .email('Format email tidak valid'),
    password: z
      .string()
      .min(1, 'Password wajib diisi')
      .min(8, 'Password minimal 8 karakter'),
    confirmPassword: z
      .string()
      .min(1, 'Konfirmasi password wajib diisi'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password tidak cocok',
    path: ['confirmPassword'],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

const EyeIcon = ({ visible, setShowPassword }: { visible: boolean, setShowPassword: React.Dispatch<React.SetStateAction<boolean>> }) => (
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

export function RegisterForm() {
  const [showPassword, setShowPassword] = React.useState(false)

  const registerMutation = useRegisterMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = (values: RegisterFormValues) => {
    registerMutation.mutate({ name: values.name, email: values.email, password: values.password })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Nama Lengkap"
        type="text"
        placeholder="Budi Santoso"
        {...register('name')}
        error={errors.name?.message}
        autoComplete="name"
      />
      <Input
        label="Email"
        type="email"
        placeholder="budi@example.com"
        {...register('email')}
        error={errors.email?.message}
        autoComplete="email"
      />
      <Input
        label="Password"
        type={showPassword ? 'text' : 'password'}
        placeholder="Minimal 8 karakter"
        {...register('password')}
        error={errors.password?.message}
        helperText={!errors.password ? 'Minimal 8 karakter' : undefined}
        autoComplete="new-password"
        rightIcon={<EyeIcon visible={showPassword} setShowPassword={setShowPassword}/>}
      />
      <Input
        label="Konfirmasi Password"
        type={showPassword ? 'text' : 'password'}
        placeholder="Ulangi password"
        {...register('confirmPassword')}
        error={errors.confirmPassword?.message}
        autoComplete="new-password"
      />
      <Button
        type="submit"
        variant="primary"
        loading={registerMutation.isPending}
        className="w-full mt-2 text-md "
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
