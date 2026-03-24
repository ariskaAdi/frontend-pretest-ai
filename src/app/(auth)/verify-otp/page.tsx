import { AuthLayout } from '@/components/layouts/Auth'
import { OTPForm } from '@/components/features/auth/OTPForm'

export default function VerifyOTPPage() {
  return (
    <AuthLayout
      title="Verifikasi Email"
      subtitle="Masukkan kode OTP yang dikirim ke emailmu"
    >
      <OTPForm />
    </AuthLayout>
  )
}
