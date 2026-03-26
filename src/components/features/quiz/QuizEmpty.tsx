import * as React from 'react'
import Link from 'next/link'
import { Card } from '@/components/shared/Card'
import { Button } from '@/components/shared/Button'

export function QuizEmpty() {
  return (
    <Card className="flex flex-col items-center justify-center p-12 py-20 bg-white border-none shadow-sm rounded-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="w-24 h-24 rounded-full bg-warning/10 text-warning flex items-center justify-center text-5xl mb-6">
        🎯
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Belum Ada Riwayat Quiz</h3>
      <p className="text-gray-400 text-center max-w-sm mb-8">
        Anda belum pernah mengerjakan quiz apapun. Pilih salah satu modul Anda dan mulai uji pemahaman Anda sekarang!
      </p>
      <Link href="/modules">
        <Button className="rounded-xl px-8 font-bold">
          Pilih Modul
        </Button>
      </Link>
    </Card>
  )
}
