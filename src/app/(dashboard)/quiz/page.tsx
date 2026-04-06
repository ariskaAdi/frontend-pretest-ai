'use client'

import * as React from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useQuizHistoryQuery } from '@/queries/useQuizQuery'
import { useModulesQuery } from '@/queries/useModuleQuery'
import {
  QuizHistory,
  QuizEmpty,
  GenerateQuizModal
} from '@/components/features/quiz'
import { Spinner } from '@/components/shared/Spinner'
import { Button } from '@/components/shared/Button'
import Link from 'next/link'

export default function QuizPage() {
  const t = useTranslations('QuizPage')
  const searchParams = useSearchParams()
  const moduleIdParam = searchParams.get('module_id')

  const { data: quizzes, isLoading: isLoadingQuizzes } = useQuizHistoryQuery()
  const { data: modules } = useModulesQuery()

  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [selectedModule, setSelectedModule] = React.useState<{ id: string; title: string } | null>(null)

  React.useEffect(() => {
    if (moduleIdParam && modules) {
      const module = modules.find(m => m.id === moduleIdParam)
      if (module) {
        setSelectedModule({ id: module.id, title: module.title })
        setIsModalOpen(true)
      }
    }
  }, [moduleIdParam, modules])

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  if (isLoadingQuizzes) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Spinner size="lg" className="mb-4" />
        <p className="text-gray-500 font-medium animate-pulse">{t('loading')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">{t('title')}</h1>
          <p className="text-gray-500 font-medium">{t('subtitle')}</p>
        </div>
        {!quizzes || quizzes.length === 0 ? null : (
          <Link href="/modules">
            <Button className="rounded-2xl font-bold shadow-lg shadow-primary/20 hover:shadow-xl transition-all">
              {t('createNewQuiz')}
            </Button>
          </Link>
        )}
      </div>

      {!quizzes || quizzes.length === 0 ? (
        <QuizEmpty />
      ) : (
        <QuizHistory quizzes={quizzes} />
      )}

      {selectedModule && (
        <GenerateQuizModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          moduleId={selectedModule.id}
          moduleTitle={selectedModule.title}
        />
      )}
    </div>
  )
}
