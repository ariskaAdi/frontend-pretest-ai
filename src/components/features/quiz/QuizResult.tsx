import { useTranslations } from 'next-intl'
import { BookOpen } from 'lucide-react'
import { Card } from '@/components/shared/Card'
import { MathText } from '@/components/shared/MathText'
import type { QuizQuestionResult } from '@/types/quiz.types'

interface QuizResultProps {
  questions: QuizQuestionResult[]
  isLoadingExplanation?: boolean
}

const OPTION_LABELS = ['A', 'B', 'C', 'D'] as const

export function QuizResult({ questions, isLoadingExplanation }: QuizResultProps) {
  const t = useTranslations('QuizResultComponent')

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4 px-2 tracking-tight">{t('reviewTitle')}</h3>

      {questions.map((q, i) => (
        <div
          key={q.id}
          className="animate-in fade-in slide-in-from-bottom-4 duration-500"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <Card className="p-6 border-none shadow-sm rounded-3xl bg-white overflow-hidden relative">
            {/* Status Indicator Bar */}
            <div className={`absolute top-0 left-0 bottom-0 w-2 ${q.is_correct ? 'bg-success' : 'bg-danger'}`} />

            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black ${q.is_correct ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                  {i + 1}
                </div>
                <h4 className="font-bold text-gray-900 leading-snug"><MathText text={q.text} /></h4>
              </div>
              <div className={`shrink-0 ml-4 p-2 rounded-xl ${q.is_correct ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                {q.is_correct ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-11">
              {q.options.map((option, index) => {
                const label = OPTION_LABELS[index]
                const isUserAnswer = q.user_answer === label
                const isCorrectAnswer = q.correct_answer === label

                let variantClasses = 'bg-gray-50 text-gray-400 border-gray-50'
                if (isCorrectAnswer) variantClasses = 'bg-success/5 text-success border-success/20 ring-1 ring-success/10'
                if (isUserAnswer && !q.is_correct) variantClasses = 'bg-danger/5 text-danger border-danger/20 ring-1 ring-danger/10'

                return (
                  <div
                    key={label}
                    className={`p-3 px-4 rounded-xl border text-xs font-bold flex items-center gap-3 ${variantClasses}`}
                  >
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 ${isCorrectAnswer ? 'bg-success text-white' : isUserAnswer && !q.is_correct ? 'bg-danger text-white' : 'bg-white text-gray-400 border border-gray-100'}`}>
                      {label}
                    </div>
                    <span className="flex-1">
                      <MathText text={option.replace(/^[A-D]\.\s*/, '')} />
                      {isUserAnswer && !q.is_correct && <span className="ml-2 opacity-60">{t('yourAnswer')}</span>}
                      {isCorrectAnswer && <span className="ml-2 opacity-60">{t('correct')}</span>}
                    </span>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Explanation card — only for wrong answers */}
          {!q.is_correct && (
            <div className="mt-3 ml-2">
              {isLoadingExplanation && !q.explanation ? (
                <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-warning/5 border border-warning/20">
                  <div className="w-4 h-4 border-2 border-warning border-t-transparent rounded-full animate-spin shrink-0" />
                  <p className="text-xs text-warning font-medium">{t('explanationLoading')}</p>
                </div>
              ) : q.explanation ? (
                <div className="flex items-start gap-3 px-5 py-4 rounded-2xl bg-primary/5 border border-primary/10">
                  <BookOpen size={16} className="text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{t('explanationLabel')}</p>
                    <MathText text={q.explanation} className="text-xs text-gray-600 leading-relaxed" />
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
