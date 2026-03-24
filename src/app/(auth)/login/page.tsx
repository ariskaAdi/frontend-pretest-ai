import { AuthLayout } from '@/components/layouts/Auth'
import { LoginForm } from '@/components/features/auth/LoginForm'

export default function LoginPage() {
  return (
    <AuthLayout
      title="Selamat Datang"
      subtitle="Masuk ke akun kamu untuk melanjutkan belajar"
    >
      <LoginForm />
    </AuthLayout>
  )
}
