import { AuthLayout } from '@/components/layouts/Auth'
import { RegisterForm } from '@/components/features/auth/RegisterForm'

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Buat Akun Baru"
      subtitle="Daftar dan mulai belajar bersama PreTest AI"
    >
      <RegisterForm />
    </AuthLayout>
  )
}
