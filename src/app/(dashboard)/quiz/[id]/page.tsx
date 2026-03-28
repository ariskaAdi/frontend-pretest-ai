'use client'

import * as React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { AlertTriangle } from 'lucide-react'
import { QuizQuestion } from '@/components/features/quiz'
import { Button } from '@/components/shared/Button'
import { Modal } from '@/components/shared/Modal'
import { useSubmitQuizMutation } from '@/queries/useQuizQuery'
import { useToast } from '@/components/shared/Toast'
import type { QuizResponse, SubmitAnswer } from '@/types/quiz.types'

export default function QuizSessionPage() {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const queryClient = useQueryClient()
  const { toast } = useToast()
  
  // Ambil data dari cache (setQueryData di useGenerateQuizMutation)
  const quiz = queryClient.getQueryData(['quiz', 'session', id]) as QuizResponse | undefined
  
  const [currentPage, setCurrentPage] = React.useState(0)
  const [answers, setAnswers] = React.useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({})
  const [isSubmitModalOpen, setIsSubmitModalOpen] = React.useState(false)
  
  const { mutate: submitQuiz, isPending: isSubmitting } = useSubmitQuizMutation()
  
  // Guard: Jika user refresh, data cache hilang (karena tidak ada GET /quiz/:id)
  if (!quiz) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-20 h-20 rounded-full bg-danger/10 text-danger flex items-center justify-center mb-6">
          <AlertTriangle size={40} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Sesi Quiz Berakhir</h2>
        <p className="text-gray-500 max-w-md mb-8">
          Maaf, sesi quiz tidak ditemukan atau telah kedaluwarsa karena halaman di-refresh. 
          Silakan buat quiz baru dari halaman modul.
        </p>
        <Button onClick={() => router.push('/quiz')} className="rounded-xl px-8">
          Kembali ke Riwayat
        </Button>
      </div>
    )
  }

  const currentQuestion = quiz.questions[currentPage]
  const isLastQuestion = currentPage === quiz.questions.length - 1
  const allAnswered = quiz.questions.every(q => answers[q.id] !== undefined)

  const handleSelect = (answer: 'A' | 'B' | 'C' | 'D') => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }))
  }

  const handleSubmit = () => {
    const formattedAnswers: SubmitAnswer[] = Object.entries(answers).map(([question_id, answer]) => ({
      question_id,
      answer
    }))

    submitQuiz(
      { quizId: id, data: { answers: formattedAnswers } },
      {
        onSuccess: () => {
          toast.success('Quiz berhasil dikirim!')
          router.push(`/quiz/${id}/result`)
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.error || 'Gagal mengirim jawaban')
        }
      }
    )
  }

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <div className="mb-10 flex items-center justify-between">
        <h2 className="text-xl font-black text-gray-900 line-clamp-1 flex-1 mr-4">
          {quiz.module_title}
        </h2>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-danger hover:bg-danger/5 font-bold"
          onClick={() => router.push('/quiz')}
        >
          Keluar
        </Button>
      </div>

      <QuizQuestion
        question={currentQuestion}
        questionNumber={currentPage + 1}
        totalQuestions={quiz.questions.length}
        selectedAnswer={answers[currentQuestion.id]}
        onSelect={handleSelect}
      />

      {/* Navigation Buttons */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-64 bg-white/80 backdrop-blur-md border-t border-gray-100 p-4 z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <Button
            variant="ghost"
            disabled={currentPage === 0}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="rounded-xl px-6 font-bold"
          >
            ← Sebelumnya
          </Button>

          {isLastQuestion ? (
            <Button
              className="rounded-xl px-10 font-black shadow-lg shadow-primary/20"
              onClick={() => setIsSubmitModalOpen(true)}
              disabled={!allAnswered}
            >
              Submit Quiz
            </Button>
          ) : (
            <Button
              className="rounded-xl px-8 font-bold"
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              Berikutnya →
            </Button>
          )}
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      <Modal 
        open={isSubmitModalOpen} 
        onClose={() => setIsSubmitModalOpen(false)}
        title="Kirim Jawaban?"
      >
        <div className="space-y-6 pt-2">
          <p className="text-gray-500 leading-relaxed">
            Apakah Anda yakin ingin mengirim jawaban sekarang? Anda tidak dapat mengubah jawaban setelah dikirim.
          </p>
          <div className="flex gap-3">
            <Button 
              variant="ghost" 
              className="flex-1 rounded-xl"
              onClick={() => setIsSubmitModalOpen(false)}
            >
              Batal
            </Button>
            <Button 
              className="flex-1 rounded-xl font-bold"
              onClick={handleSubmit}
              loading={isSubmitting}
            >
              Ya, Kirim
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
