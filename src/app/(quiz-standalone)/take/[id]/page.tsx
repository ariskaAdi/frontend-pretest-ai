'use client'
import type { APIError } from '@/types/api.types'

import * as React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AlertTriangle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { QuizQuestion } from '@/components/features/quiz'
import { Button } from '@/components/shared/Button'
import { Modal } from '@/components/shared/Modal'
import { CountdownTimer } from '@/components/shared/CountdownTimer'
import { useSubmitQuizMutation, useCancelQuizMutation } from '@/queries/useQuizQuery'
import { useToast } from '@/components/shared/Toast'
import type { QuizResponse, SubmitAnswer } from '@/types/quiz.types'

const quizSessionKey = (id: string) => `quiz-session-${id}`
const quizTimerKey = (id: string) => `quiz-timer-${id}`

interface TimerConfig {
  durationMinutes: 30 | 60
  startTime: string
}

export default function QuizStandalonePage() {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const { toast } = useToast()
  const t = useTranslations('QuizSession')

  // null on server, populated from localStorage after mount — avoids SSR/client hydration mismatch
  const [isMounted, setIsMounted] = React.useState(false)
  const [quiz, setQuiz] = React.useState<QuizResponse | null>(null)
  const [timerConfig, setTimerConfig] = React.useState<TimerConfig | null>(null)

  React.useEffect(() => {
    try {
      const quizStored = localStorage.getItem(quizSessionKey(id))
      if (quizStored) setQuiz(JSON.parse(quizStored) as QuizResponse)

      const timerStored = localStorage.getItem(quizTimerKey(id))
      if (timerStored) setTimerConfig(JSON.parse(timerStored) as TimerConfig)
    } catch { /* localStorage unavailable */ }
    setIsMounted(true)
  }, [id])

  const endTime = React.useMemo(() => {
    if (!timerConfig) return null
    const start = new Date(timerConfig.startTime).getTime()
    return new Date(start + timerConfig.durationMinutes * 60 * 1000)
  }, [timerConfig])

  const [currentPage, setCurrentPage] = React.useState(0)
  const [answers, setAnswers] = React.useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({})
  const [isSubmitModalOpen, setIsSubmitModalOpen] = React.useState(false)
  const [isExitModalOpen, setIsExitModalOpen] = React.useState(false)
  const [isSubmitted, setIsSubmitted] = React.useState(false)

  const { mutate: submitQuiz, isPending: isSubmitting } = useSubmitQuizMutation()
  const { mutate: cancelQuiz, isPending: isCancelling } = useCancelQuizMutation()

  // Warn before closing/leaving tab while quiz is active
  React.useEffect(() => {
    if (!quiz || isSubmitted) return
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [quiz, isSubmitted])

  const clearStorage = React.useCallback(() => {
    try {
      localStorage.removeItem(quizSessionKey(id))
      localStorage.removeItem(quizTimerKey(id))
    } catch { /* ignore */ }
  }, [id])

  const doSubmit = React.useCallback(
    (overrideAnswers?: Record<string, 'A' | 'B' | 'C' | 'D'>) => {
      if (!quiz || isSubmitted) return
      const answersToUse = overrideAnswers ?? answers

      // Only send answered questions — backend treats missing answers as wrong (never correct)
      const formattedAnswers: SubmitAnswer[] = quiz.questions
        .filter(q => answersToUse[q.id] !== undefined)
        .map(q => ({ question_id: q.id, answer: answersToUse[q.id] }))

      submitQuiz(
        { quizId: id, data: { answers: formattedAnswers } },
        {
          onSuccess: () => {
            setIsSubmitted(true)
            clearStorage()
            toast.success(t('toastSubmitted'))
            router.push(`/quiz/${id}/result`)
          },
          onError: (error: APIError) => {
            toast.error(error.response?.data?.error || t('toastSubmitFailed'))
          },
        }
      )
    },
    [quiz, isSubmitted, answers, id, submitQuiz, clearStorage, router, toast, t]
  )

  const handleTimerExpire = React.useCallback(() => {
    if (isSubmitted) return
    toast.error(t('timeUpAutoSubmit'))
    doSubmit()
  }, [isSubmitted, doSubmit, toast, t])

  // Show spinner until localStorage is read — prevents "not found" flash on first render
  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!quiz) {
    const handleCancel = () => {
      cancelQuiz(id, {
        onSuccess: () => {
          clearStorage()
          toast.success(t('toastCancelled'))
          window.close()
        },
        onError: (error: APIError) => {
          toast.error(error.response?.data?.error || t('toastCancelFailed'))
          window.close()
        },
      })
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-gray-50">
        <div className="w-20 h-20 rounded-full bg-danger/10 text-danger flex items-center justify-center mb-6">
          <AlertTriangle size={40} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('notFoundTitle')}</h2>
        <p className="text-gray-500 max-w-md mb-8">{t('notFoundDesc')}</p>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => window.close()} className="rounded-xl px-6">
            {t('closeTab')}
          </Button>
          <Button onClick={handleCancel} loading={isCancelling} className="rounded-xl px-6">
            {t('cancelReturnQuota')}
          </Button>
        </div>
      </div>
    )
  }

  const currentQuestion = quiz.questions[currentPage]
  const isLastQuestion = currentPage === quiz.questions.length - 1
  const allAnswered = quiz.questions.every(q => answers[q.id] !== undefined)
  const answeredCount = Object.keys(answers).length

  const handleSelect = (answer: 'A' | 'B' | 'C' | 'D') => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky header — no sidebar offset */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <h2 className="text-base font-black text-gray-900 line-clamp-1 flex-1">
            {quiz.module_title}
          </h2>
          <div className="flex items-center gap-3 shrink-0">
            {endTime && (
              <CountdownTimer endTime={endTime} onExpire={handleTimerExpire} />
            )}
            <Button
              variant="ghost"
              size="sm"
              className="text-danger hover:bg-danger/5 font-bold"
              onClick={() => setIsExitModalOpen(true)}
            >
              {t('exit')}
            </Button>
          </div>
        </div>
      </div>

      {/* Question content */}
      <div className="max-w-3xl mx-auto px-4 pt-8 pb-28">
        <QuizQuestion
          question={currentQuestion}
          questionNumber={currentPage + 1}
          totalQuestions={quiz.questions.length}
          selectedAnswer={answers[currentQuestion.id]}
          onSelect={handleSelect}
        />
      </div>

      {/* Fixed bottom nav — full width, no sidebar offset */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 p-4 z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <Button
            variant="ghost"
            disabled={currentPage === 0}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="rounded-xl px-6 font-bold"
          >
            {t('previous')}
          </Button>

          <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
            {answeredCount}/{quiz.questions.length} {t('answered')}
          </span>

          {isLastQuestion ? (
            <Button
              className="rounded-xl px-10 font-black shadow-lg shadow-primary/20"
              onClick={() => setIsSubmitModalOpen(true)}
              disabled={!allAnswered}
              loading={isSubmitting}
            >
              {t('submitQuiz')}
            </Button>
          ) : (
            <Button
              className="rounded-xl px-8 font-bold"
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              {t('next')}
            </Button>
          )}
        </div>
      </div>

      {/* Submit confirmation modal */}
      <Modal
        open={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title={t('submitModalTitle')}
        closeOnOverlayClick={false}
      >
        <div className="space-y-6 pt-2">
          <p className="text-gray-500 leading-relaxed">{t('submitModalDesc')}</p>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              className="flex-1 rounded-xl"
              onClick={() => setIsSubmitModalOpen(false)}
            >
              {t('cancel')}
            </Button>
            <Button
              className="flex-1 rounded-xl font-bold"
              onClick={() => { setIsSubmitModalOpen(false); doSubmit() }}
              loading={isSubmitting}
            >
              {t('yesSubmit')}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Exit / close-tab confirmation modal */}
      <Modal
        open={isExitModalOpen}
        onClose={() => setIsExitModalOpen(false)}
        title={t('exitModalTitle')}
        closeOnOverlayClick={false}
      >
        <div className="space-y-6 pt-2">
          <p className="text-gray-500 leading-relaxed">{t('exitModalDesc')}</p>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              className="flex-1 rounded-xl font-bold"
              onClick={() => setIsExitModalOpen(false)}
            >
              {t('stayInQuiz')}
            </Button>
            <Button
              variant="danger"
              className="flex-1 rounded-xl font-bold"
              onClick={() => window.close()}
            >
              {t('closeTab')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
