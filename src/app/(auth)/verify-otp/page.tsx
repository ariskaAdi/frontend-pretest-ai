import { AuthLayout } from '@/components/layouts/Auth'
import { OTPForm } from '@/components/features/auth/OTPForm'

export default function VerifyOTPPage() {
  return (
    <AuthLayout
      title="Verify Your Email"
      subtitle="Enter the OTP code sent to your email"
    >
      <OTPForm />
    </AuthLayout>
  )
}
