'use client'

import * as React from 'react'
import { WelcomeBanner } from '@/components/features/dashboard/WelcomeBanner'
import { StatCard } from '@/components/features/dashboard/StatCard'
import { useModulesQuery } from '@/queries/useModuleQuery'
import { useQuizHistoryQuery } from '@/queries/useQuizQuery'
import { Card } from '@/components/shared/Card'
import { Badge } from '@/components/shared/Badge'
import { Spinner } from '@/components/shared/Spinner'
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
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
        variant: 'info' as const,
        description: 'Modul materi yang diupload'
      },
      {
        label: 'Quiz Selesai',
        value: finishedQuizzes,
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"/><path d="m3 3 3 3"/><path d="m21 21-3-3"/><path d="M7 6.5 4.5 9 10 14.5l8.5-8.5L21 3.5"/><path d="M11 19h10"/><path d="M12 11 9 8l-6.5 6.5L6 18l3.5-3.5"/></svg>,
        variant: 'success' as const,
        description: 'Latihan soal dikerjakan'
      },
      {
        label: 'Rata-rata Skor',
        value: `${avgScore}%`,
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>,
        variant: 'warning' as const,
        description: 'Akumulasi skor semua quiz'
      },
      {
        label: 'Modul Pending',
        value: pendingModules,
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
        variant: 'default' as const,
        description: 'Ringkasan diselesaikan AI'
      }
    ]
  }, [modules, quizHistory])

  if (isLoadingModules || isLoadingQuiz) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Spinner size="lg" className="mb-4" />
        <p className="text-gray-500 font-medium animate-pulse">Memuat data dashboard...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <WelcomeBanner />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={stat.label} className={`animate-in fade-in slide-in-from-bottom-4 duration-500`} style={{ animationDelay: `${i * 100}ms` }}>
            <StatCard {...stat} />
          </div>
        ))}
      </div>

      {/* Two Column Layout for Lists */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
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
                    <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center font-bold">
                       📄
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
                    <div className="w-10 h-10 rounded-xl bg-warning/10 text-warning flex items-center justify-center font-bold">
                       🎯
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
