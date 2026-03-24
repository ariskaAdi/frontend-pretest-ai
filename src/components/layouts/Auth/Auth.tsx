import * as React from 'react'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left — Branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col items-center justify-center p-12 text-white">
        <div className="max-w-md text-center space-y-6">
          <h1 className="text-4xl font-bold">PreTest AI</h1>
          <p className="text-lg text-white/80">
            Platform belajar berbasis AI untuk mempersiapkan ujianmu
          </p>
          <div className="border-t border-white/20 pt-6">
            <blockquote className="text-white/70 italic">
              &ldquo;Belajar bukan tentang seberapa banyak yang kamu hafal,
              tapi seberapa dalam kamu memahami.&rdquo;
            </blockquote>
          </div>
        </div>
      </div>

      {/* Right — Form area */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-sm">
          {/* Logo — mobile only */}
          <div className="lg:hidden text-center mb-8">
            <span className="text-2xl font-bold text-primary">PreTest AI</span>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}
