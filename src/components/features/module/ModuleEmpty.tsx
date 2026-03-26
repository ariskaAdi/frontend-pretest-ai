'use client'

import * as React from 'react'
import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import { Button } from '@/components/shared/Button'

export function ModuleEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-3xl border-2 border-dashed border-gray-100 animate-in fade-in zoom-in duration-500">
      <div className="w-20 h-20 bg-primary-light rounded-2xl flex items-center justify-center text-primary mb-6 shadow-sm">
        <BookOpen size={40} />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">Belum ada modul diupload</h3>
      <p className="text-gray-500 max-w-sm mb-8">
        Upload materi belajar Anda dalam format PDF untuk dirangkum secara otomatis oleh AI dan generate quiz latihan.
      </p>
      <Link href="/modules/upload">
        <Button size="lg" className="px-8 shadow-md shadow-primary/20">
          Upload Modul Pertama
        </Button>
      </Link>
    </div>
  )
}
