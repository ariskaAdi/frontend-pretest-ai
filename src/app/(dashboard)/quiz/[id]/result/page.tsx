'use client'

import * as React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { useQuizResultQuery, useRetryQuizMutation } from '@/queries/useQuizQuery'
import { QuizResult } from '@/components/features/quiz'
import { Card } from '@/components/shared/Card'
import { Button } from '@/components/shared/Button'
import { Spinner } from '@/components/shared/Spinner'
import { useToast } from '@/components/shared/Toast'

export default function QuizResultPage() {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  // Prioritaskan data dari cache jika baru saja submit
  const cachedResult = queryClient.getQueryData(['quiz', 'result', id])
  const { data: result, isLoading } = useQuizResultQuery(id)
  const displayData = cachedResult || result

  const { mutate: retryQuiz, isPending: isRetrying } = useRetryQuizMutation()

  const handleRetry = () => {
    retryQuiz(id, {
      onSuccess: (res) => {
        const newQuiz = res.data.data
        toast.success('Memulai ulang quiz...')
        router.push(`/quiz/${newQuiz.id}`)
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Gagal mengulang quiz')
      }
    })
  }

  if (isLoading && !cachedResult) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Spinner size="lg" className="mb-4" />
        <p className="text-gray-500 font-medium animate-pulse">Memuat hasil quiz...</p>
      </div>
    )
  }

  if (!displayData) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Hasil quiz tidak ditemukan.</p>
        <Button onClick={() => router.push('/quiz')} className="mt-4">Kembali</Button>
      </div>
    )
  }

  const isPassed = (displayData as any).score >= 70

  return (
    <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      {/* Score Header */}
      <Card className="p-10 border-none shadow-lg shadow-primary/5 rounded-[40px] bg-white text-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-warning/10 rounded-full translate-x-1/2 translate-y-1/2" />
        
        <div className="relative z-10">
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-4">Skor Akhir Anda</p>
          <div className="flex flex-col items-center justify-center mb-6">
            <span className={`text-8xl font-black ${(displayData as any).score >= 70 ? 'text-success' : 'text-danger'}`}>
              {(displayData as any).score}
            </span>
            <span className="text-gray-300 font-bold">dari 100</span>
          </div>

          <div className={`
            inline-flex items-center gap-2 px-6 py-2 rounded-2xl font-black text-sm uppercase tracking-wider mb-8
            ${isPassed ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}
          `}>
             {isPassed ? '🎯 Lulus' : '💪 Coba Lagi'}
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <Button 
              onClick={handleRetry} 
              className="flex-1 rounded-2xl font-bold py-6 text-base shadow-xl shadow-primary/20"
              loading={isRetrying}
            >
               🔁 Ulangi Quiz
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => router.push('/modules')}
              className="flex-1 rounded-2xl font-bold py-6 text-base"
            >
               ← Kembali ke Modul
            </Button>
          </div>
        </div>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-3xl border border-gray-50 shadow-sm text-center">
            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Total Soal</p>
            <p className="text-2xl font-black text-gray-900">{(displayData as any).num_questions}</p>
         </div>
         <div className="bg-white p-6 rounded-3xl border border-gray-50 shadow-sm text-center">
            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Benar</p>
            <p className="text-2xl font-black text-success">
              {(displayData as any).questions.filter((q: any) => q.is_correct).length}
            </p>
         </div>
         <div className="bg-white p-6 rounded-3xl border border-gray-50 shadow-sm text-center col-span-2 md:col-span-1">
            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Salah</p>
            <p className="text-2xl font-black text-danger">
              {(displayData as any).questions.filter((q: any) => !q.is_correct).length}
            </p>
         </div>
      </div>

      {/* Detail Review */}
      <QuizResult questions={(displayData as any).questions} />
    </div>
  )
}
