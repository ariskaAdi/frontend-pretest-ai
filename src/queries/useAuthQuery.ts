'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authService } from '@/services/authService'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from '@/components/shared'
import type {
  LoginRequest,
  RegisterRequest,
  VerifyOTPRequest,
  UpdateEmailRequest,
  VerifyUpdateEmailRequest,
} from '@/types/auth.types'

export function useLoginMutation() {
  const { setAuth } = useAuthStore()
  const { toast } = useToast()
  const router = useRouter()

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (res) => {
      setAuth(res.data.data.token, res.data.data.user)
      toast.success('Login berhasil!')
      router.push('/dashboard')
    },
    onError: (err: any) => {
      const message: string = err.response?.data?.error ?? ''
      if (message.toLowerCase().includes('belum diverifikasi') || message.toLowerCase().includes('not verified')) {
        toast.warning('Email belum diverifikasi. Silakan verifikasi email kamu.')
      } else {
        toast.error(message || 'Email atau password salah')
      }
    },
  })
}

export function useRegisterMutation() {
  const { toast } = useToast()
  const router = useRouter()

  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (_, variables) => {
      sessionStorage.setItem('pending_email', variables.email)
      sessionStorage.setItem('pending_registration', JSON.stringify(variables))
      toast.success('Registrasi berhasil! Cek email kamu untuk kode OTP.')
      router.push('/verify-otp')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error ?? 'Registrasi gagal')
    },
  })
}

export function useVerifyOTPMutation() {
  const { toast } = useToast()
  const router = useRouter()

  return useMutation({
    mutationFn: (data: VerifyOTPRequest) => authService.verifyOTP(data),
    onSuccess: () => {
      sessionStorage.removeItem('pending_email')
      sessionStorage.removeItem('pending_registration')
      toast.success('Email berhasil diverifikasi!')
      router.push('/login')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error ?? 'OTP salah atau kadaluarsa')
    },
  })
}

export function useLogoutMutation() {
  const { clearAuth } = useAuthStore()
  const router = useRouter()

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      clearAuth()
      router.push('/login')
    },
    onError: () => {
      clearAuth()
      router.push('/login')
    },
  })
}

export function useRequestUpdateEmailMutation() {
  const { toast } = useToast()

  return useMutation({
    mutationFn: (data: UpdateEmailRequest) => authService.requestUpdateEmail(data),
    onSuccess: () => {
      toast.success('Kode OTP telah dikirim ke email baru kamu.')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error ?? 'Gagal mengirim OTP')
    },
  })
}

export function useVerifyUpdateEmailMutation() {
  const { toast } = useToast()
  const { token, user, setAuth } = useAuthStore()

  return useMutation({
    mutationFn: (data: VerifyUpdateEmailRequest) => authService.verifyUpdateEmail(data),
    onSuccess: (_, variables) => {
      if (token && user) {
        setAuth(token, { ...user, email: variables.new_email })
      }
      toast.success('Email berhasil diperbarui!')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error ?? 'Gagal memperbarui email')
    },
  })
}
