'use client'

import * as React from 'react'
import Link from 'next/link'
import { Lightbulb } from 'lucide-react'
import { UploadForm } from '@/components/features/module'
import { Card } from '@/components/shared/Card'

export default function UploadPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex flex-col gap-2">
        <Link 
          href="/modules" 
          className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-primary transition-colors w-fit group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-1"><path d="m15 18-6-6 6-6"/></svg>
          Kembali ke Koleksi
        </Link>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Upload Modul Baru</h1>
        <p className="text-gray-500">Pilih file PDF yang ingin Anda rangkum dan buat latihannya</p>
      </div>

      <Card className="p-8 border-none shadow-sm rounded-[32px] bg-white">
        <UploadForm />
      </Card>

      <div className="bg-primary-light/30 border border-primary-light rounded-2xl p-4 flex gap-4">
        <div className="text-primary">
          <Lightbulb size={24} />
        </div>
        <div className="text-sm text-gray-600 leading-relaxed">
          <span className="font-bold text-primary italic">Tips: </span>
          Pastikan PDF Anda memiliki teks yang dapat dibaca (bukan hasil scan gambar) agar AI dapat memberikan rangkuman yang lebih akurat dan berkualitas.
        </div>
      </div>
    </div>
  )
}
