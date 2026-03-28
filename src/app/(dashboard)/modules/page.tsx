'use client'

import * as React from 'react'
import { ModuleList, ModuleEmpty, UploadForm } from '@/components/features/module'
import { useModulesQuery } from '@/queries/useModuleQuery'
import { Button } from '@/components/shared/Button'
import { Spinner } from '@/components/shared/Spinner'
import { Modal } from '@/components/shared/Modal'
import { Lightbulb } from 'lucide-react'

export default function ModulesPage() {
  const { data: modules, isLoading } = useModulesQuery()
  

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Koleksi Modul</h1>
          <p className="text-gray-500">Kelola semua materi belajar Anda di sini</p>
        </div>
       
      </div>

      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-40">
          <Spinner size="lg" className="mb-4" />
          <p className="text-gray-500 font-medium animate-pulse">Memuat daftar modul...</p>
        </div>
      ) : !modules || modules.length === 0 ? (
        <ModuleEmpty />
      ) : (
        <ModuleList modules={modules} />
      )}
    </div>
  )
}
