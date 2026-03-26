'use client'

import * as React from 'react'
import { Button } from '@/components/shared'
import { useVerifyOTPMutation } from '@/queries/useAuthQuery'
import { authService } from '@/services/authService'
import { useToast } from '@/components/shared'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

export function OTPForm() {
  const [digits, setDigits] = React.useState<string[]>(Array(6).fill(''))
  const [email, setEmail] = React.useState('')
  const [resending, setResending] = React.useState(false)
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()
  const { toast } = useToast()
  const verifyMutation = useVerifyOTPMutation()

  React.useEffect(() => {
    const stored = sessionStorage.getItem('pending_email')
    if (!stored) {
      router.replace('/register')
      return
    }
    setEmail(stored)
    inputRefs.current[0]?.focus()
  }, [router])

  const submitOTP = React.useCallback(
    (otp: string) => {
      if (!email) return
      verifyMutation.mutate({ email, otp })
    },
    [email, verifyMutation]
  )

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1)
    const newDigits = [...digits]
    newDigits[index] = digit
    setDigits(newDigits)

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    if (digit && index === 5 && newDigits.every((d) => d)) {
      submitOTP(newDigits.join(''))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pasted) return

    const newDigits = Array(6).fill('')
    pasted.split('').forEach((char, i) => {
      newDigits[i] = char
    })
    setDigits(newDigits)

    const nextIndex = Math.min(pasted.length, 5)
    inputRefs.current[nextIndex]?.focus()

    if (pasted.length === 6) {
      submitOTP(pasted)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const otp = digits.join('')
    if (otp.length < 6) {
      toast.warning('Masukkan 6 digit OTP')
      return
    }
    submitOTP(otp)
  }

  const handleResend = async () => {
    const stored = sessionStorage.getItem('pending_registration')
    if (!stored) {
      toast.error('Data registrasi tidak ditemukan. Silakan daftar ulang.')
      router.push('/register')
      return
    }
    try {
      setResending(true)
      const data = JSON.parse(stored)
      await authService.register(data)
      toast.success('OTP baru telah dikirim ke email kamu.')
      setDigits(Array(6).fill(''))
      inputRefs.current[0]?.focus()
    } catch {
      toast.error('Gagal mengirim ulang OTP')
    } finally {
      setResending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {email && (
        <p className="text-sm text-gray-600">
          Kode OTP dikirim ke:{' '}
          <span className="font-medium text-gray-900">{email}</span>
        </p>
      )}

      <div className="flex gap-2 justify-between">
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            disabled={verifyMutation.isPending}
            className={cn(
              'w-11 h-12 text-center text-lg font-semibold rounded-lg border border-gray-300 bg-white',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
              'disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors duration-200 text-black'
            )}
          />
        ))}
      </div>

      <Button
        type="submit"
        variant="primary"
        loading={verifyMutation.isPending}
        className="w-full text-md"
      >
        Verifikasi
      </Button>

      <p className="text-center text-sm text-gray-600">
        Tidak menerima kode?{' '}
        <button
          type="button"
          onClick={handleResend}
          disabled={resending || verifyMutation.isPending}
          className="text-primary font-medium hover:underline disabled:opacity-50"
        >
          {resending ? 'Mengirim...' : 'Kirim ulang OTP'}
        </button>
      </p>
    </form>
  )
}
