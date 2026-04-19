/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import type { APIError } from '@/types/api.types'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { FileText, FolderOpen } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useUploadModuleMutation } from '@/queries/useModuleQuery'
import { Button } from '@/components/shared/Button'
import { Input } from '@/components/shared/Input'
import { useToast } from '@/components/shared/Toast'
import { cn } from '@/lib/utils'
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

const uploadSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(255, "Title must be at most 255 characters"),
  file: z
    .instanceof(File, { message: "PDF file is required" })
    .refine((f) => f.type === "application/pdf", "Only PDF files are allowed")
    .refine(
      (f) => f.size <= 20 * 1024 * 1024,
      "File size must not exceed 20MB",
    ),
});

type UploadFormValues = z.infer<typeof uploadSchema>;

interface UploadFormProps {
  onSuccess?: () => void
}

export function UploadForm({ onSuccess }: UploadFormProps) {
  const t = useTranslations('UploadForm')
  const router = useRouter()
  const { toast } = useToast()
  const { mutate: uploadModule, isPending } = useUploadModuleMutation()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<UploadFormValues>({
    resolver: zodResolver(uploadSchema),
  });

  const file = watch("file") ?? null;
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
        toast.error(t('toastFileSizeError'))
        return
      }
      setValue("file", droppedFile, { shouldValidate: true })
    } else {
      toast.error(t('toastFileTypeError'))
      setValue("file", droppedFile, { shouldValidate: true })
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.size > 20 * 1024 * 1024) {
        toast.error(t('toastFileSizeError'))
        return
      }
      setValue("file", selectedFile, { shouldValidate: true })
    }
  }

  const onSubmit = (values: UploadFormValues) => {
    const formData = new FormData()
    formData.append('title', values.title)
    formData.append('file', values.file)

    uploadModule(formData, {
      onSuccess: () => {
        toast.success(t('toastUploadSuccess'))
        reset()
        onSuccess?.()
        router.push('/modules')
      },
      onError: (error: APIError) => {
        toast.error(error.response?.data?.error || t('toastUploadError'))
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-bold text-gray-700 ml-1">
          {t('titleLabel')}
        </label>
        <Input
          id="title"
          placeholder={t('titlePlaceholder')}
          {...register("title")}
          className="rounded-2xl h-12"
        />
        {errors.title && (
          <p className="text-xs text-danger ml-1 mt-1">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700 ml-1">
          {t('fileLabel')}
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
                    setValue("file", undefined as any, { shouldValidate: true })
                  }}
                  className="mt-4 text-xs font-bold text-danger hover:underline"
                >
                  {t('changeFile')}
                </button>
              </>
            ) : (
              <>
                <p className="font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                  {t('dropzoneText')}
                </p>
                <p className="text-xs text-gray-400">{t('dropzoneSubtext')}</p>
              </>
            )}
          </div>
        </div>
        {errors.file && (
          <p className="text-xs text-danger ml-1 mt-1">{errors.file.message}</p>
        )}
      </div>

      <div className="pt-4">
        <Button
          type="submit"
          size="lg"
          className="w-full h-12 rounded-2xl shadow-md shadow-primary/20 font-bold"
          disabled={isPending}
          loading={isPending}
        >
          {t('uploadButton')}
        </Button>
      </div>
    </form>
  )
}
