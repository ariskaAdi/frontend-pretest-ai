'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { FileText, FolderOpen } from 'lucide-react'
import { useUploadModuleMutation } from '@/queries/useModuleQuery'
import { Button } from '@/components/shared/Button'
import { Input } from '@/components/shared/Input'
import { useToast } from '@/components/shared/Toast'
import { cn } from '@/lib/utils'

export function UploadForm() {
  const router = useRouter()
  const { toast } = useToast()
  const { mutate: uploadModule, isPending } = useUploadModuleMutation()
  
  const [title, setTitle] = React.useState('')
  const [file, setFile] = React.useState<File | null>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type === 'application/pdf') {
      if (droppedFile.size > 20 * 1024 * 1024) {
        toast.error('Maksimum ukuran file adalah 20MB')
        return
      }
      setFile(droppedFile)
    } else {
      toast.error('Hanya file PDF yang diperbolehkan')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.size > 20 * 1024 * 1024) {
        toast.error('Maksimum ukuran file adalah 20MB')
        return
      }
      setFile(selectedFile)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !file) return

    const formData = new FormData()
    formData.append('title', title)
    formData.append('file', file)

    uploadModule(formData, {
      onSuccess: () => {
        toast.success('Modul berhasil diupload dan sedang diproses')
        router.push('/modules')
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Terjadi kesalahan saat mengupload modul')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-bold text-gray-700 ml-1">
          Judul Modul
        </label>
        <Input
          id="title"
          placeholder="Masukkan judul modul (contoh: Biologi Sel Bab 1)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="rounded-2xl h-12"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700 ml-1">
          File PDF
        </label>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "relative group flex flex-col items-center justify-center py-12 px-6 border-2 border-dashed rounded-3xl transition-all duration-300 cursor-pointer",
            isDragging ? "border-primary bg-primary-light/30 scale-[1.01]" : "border-gray-200 hover:border-primary/50 hover:bg-gray-50",
            file ? "border-primary-light bg-primary-light/10" : ""
          )}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf"
            className="hidden"
          />
          
          <div className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110",
            file ? "bg-primary text-white" : "bg-gray-100 text-gray-400 group-hover:bg-primary-light group-hover:text-primary"
          )}>
            {file ? <FileText size={32} strokeWidth={1.5} /> : <FolderOpen size={32} strokeWidth={1.5} />}
          </div>

          <div className="text-center">
            {file ? (
              <>
                <p className="font-bold text-gray-900 mb-1">{file.name}</p>
                <p className="text-xs text-gray-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setFile(null)
                  }}
                  className="mt-4 text-xs font-bold text-danger hover:underline"
                >
                  Ganti File
                </button>
              </>
            ) : (
              <>
                <p className="font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                  Klik atau drop file PDF untuk upload
                </p>
                <p className="text-xs text-gray-400">Format: PDF | Maks: 20MB</p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Button 
          type="submit" 
          size="lg" 
          className="w-full h-12 rounded-2xl shadow-md shadow-primary/20 font-bold"
          disabled={!title || !file || isPending}
          loading={isPending}
        >
          Upload Modul
        </Button>
      </div>
    </form>
  )
}
