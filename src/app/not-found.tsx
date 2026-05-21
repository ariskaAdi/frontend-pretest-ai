'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Home } from 'lucide-react'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center px-6 text-center">
      <div className="max-w-md w-full space-y-8">
        <div className="space-y-2">
          <p className="text-[#AAFF00] text-xs font-bold uppercase tracking-widest">Error 404</p>
          <h1 className="text-8xl font-black text-white leading-none">404</h1>
          <p className="text-2xl font-bold text-white mt-4">Halaman tidak ditemukan</p>
          <p className="text-gray-500 text-sm leading-relaxed mt-2">
            Halaman yang kamu cari tidak ada atau sudah dipindahkan.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 text-white text-sm font-semibold px-6 py-3 hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#AAFF00] text-black text-sm font-bold px-6 py-3 hover:bg-[#99ee00] transition-colors"
          >
            <Home className="w-4 h-4" />
            Ke Beranda
          </Link>
        </div>
      </div>
    </div>
  )
}
