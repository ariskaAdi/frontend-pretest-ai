/* eslint-disable @typescript-eslint/no-explicit-any */
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
      toast.success('Login successful!')
      router.push('/dashboard')
    },
    onError: (err: any, variables) => {
      const message: string = err.response?.data?.error ?? ''
      if (message.toLowerCase().includes('not verified')) {
        sessionStorage.setItem('pending_email', variables.email)
        toast.warning('Please verify your email before signing in.')
        router.push('/verify-otp')
      } else {
        toast.error(message || 'Incorrect email or password')
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
      toast.success('Registration successful! Check your email for the OTP code.')
      router.push('/verify-otp')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error ?? 'Registration failed')
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
      toast.success('Email verified successfully!')
      router.push('/login')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error ?? 'Invalid or expired OTP')
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
      toast.success('OTP code sent to your new email.')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error ?? 'Failed to send OTP')
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
      toast.success('Email updated successfully!')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error ?? 'Failed to update email')
    },
  })
}
