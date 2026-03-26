'use client'

import * as React from 'react'
import { WelcomeBanner } from '@/components/features/dashboard/WelcomeBanner'
import { StatCard } from '@/components/features/dashboard/StatCard'
import { useModulesQuery } from '@/queries/useModuleQuery'
import { useQuizHistoryQuery } from '@/queries/useQuizQuery'
import { Card } from '@/components/shared/Card'
import { Badge } from '@/components/shared/Badge'
import { Spinner } from '@/components/shared/Spinner'
import {
  BookOpen,
  CheckCircle2,
  Zap,
  Clock,
  FileText,
  Target
} from 'lucide-react'
import type { Module } from '@/types/module.types'

export default function DashboardPage() {
  const { data: modules, isLoading: isLoadingModules } = useModulesQuery()
  const { data: quizHistory, isLoading: isLoadingQuiz } = useQuizHistoryQuery()

  const stats = React.useMemo(() => {
    const totalModules = modules?.length || 0
    const finishedQuizzes = quizHistory?.length || 0
    const avgScore = quizHistory?.length
      ? Math.round(quizHistory.reduce((acc, q) => acc + (q.score || 0), 0) / quizHistory.length)
      : 0
    const pendingModules = (modules as Module[] | undefined)?.filter(m => !m.is_summarized).length || 0

    return [
      {
        label: 'Total Modul',
        value: totalModules,
        icon: <BookOpen size={20} />,
        variant: 'info' as const,
        description: 'Modul materi yang diupload'
      },
      {
        label: 'Quiz Selesai',
        value: finishedQuizzes,
        icon: <CheckCircle2 size={20} />,
        variant: 'success' as const,
        description: 'Latihan soal dikerjakan'
      },
      {
        label: 'Rata-rata Skor',
        value: `${avgScore}%`,
        icon: <Zap size={20} />,
        variant: 'warning' as const,
        description: 'Akumulasi skor semua quiz'
      },
      {
        label: 'Modul Pending',
        value: pendingModules,
        icon: <Clock size={20} />,
        variant: 'default' as const,
        description: 'Ringkasan diselesaikan AI'
      }
    ]
  }, [modules, quizHistory])

  if (isLoadingModules || isLoadingQuiz) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Spinner size="lg" className="mb-4" />
        <p className="text-gray-500 font-medium animate-pulse text-sm">Menyiapkan dashboard Anda...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <WelcomeBanner />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={stat.label} className={`animate-in fade-in slide-in-from-bottom-4`} style={{ animationDelay: `${i * 100}ms` }}>
            <StatCard {...stat} />
          </div>
        ))}
      </div>

      {/* Two Column Layout for Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Modul Terbaru */}
        <Card className="p-6 border-none shadow-sm flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Modul Terbaru</h3>
            <button className="text-sm font-semibold text-primary hover:underline">Lihat Semua</button>
          </div>

          <div className="space-y-4 flex-1">
            {!modules || modules.length === 0 ? (
              <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-2xl">
                <p className="text-gray-400 text-sm">Belum ada modul yang diupload</p>
              </div>
            ) : (
              (modules as Module[]).slice(0, 3).map((module) => (
                <div key={module.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center">
                       <FileText size={18} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">{module.title}</h4>
                      <p className="text-xs text-gray-400">{new Date(module.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <Badge variant={module.is_summarized ? 'success' : 'warning'} className="px-3 py-1 text-[10px] uppercase tracking-wider font-bold">
                    {module.is_summarized ? 'Ringkas' : 'Proses'}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Quiz Terakhir */}
        <Card className="p-6 border-none shadow-sm flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Quiz Terakhir</h3>
            <button className="text-sm font-semibold text-primary hover:underline">Lihat Semua</button>
          </div>

          <div className="space-y-4 flex-1">
            {!quizHistory || quizHistory.length === 0 ? (
              <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-2xl">
                <p className="text-gray-400 text-sm">Belum ada history quiz</p>
              </div>
            ) : (
              quizHistory.slice(0, 3).map((quiz) => (
                <div key={quiz.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-warning/10 text-warning flex items-center justify-center">
                       <Target size={18} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 group-hover:text-warning transition-colors">{quiz.module_title}</h4>
                      <p className="text-xs text-gray-400">{quiz.num_questions} Pertanyaan</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-extrabold text-gray-900">{quiz.score ?? '-'}{quiz.score !== null ? '%' : ''}</p>
                    <p className="text-[10px] text-gray-400">Skor</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
