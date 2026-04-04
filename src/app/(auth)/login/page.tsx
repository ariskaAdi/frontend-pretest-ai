import { AuthLayout } from '@/components/layouts/Auth'
import { LoginForm } from '@/components/features/auth/LoginForm'

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your account to continue learning"
    >
      <LoginForm />
    </AuthLayout>
  )
}
