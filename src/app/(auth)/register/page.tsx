import { AuthLayout } from '@/components/layouts/Auth'
import { RegisterForm } from '@/components/features/auth/RegisterForm'

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create an Account"
      subtitle="Sign up and start learning with Pretest AI"
    >
      <RegisterForm />
    </AuthLayout>
  )
}
