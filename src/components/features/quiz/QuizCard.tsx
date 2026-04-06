import Link from 'next/link'
import { Target } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Card } from '@/components/shared/Card'
import { Badge } from '@/components/shared/Badge'
import { Button } from '@/components/shared/Button'
import type { QuizHistoryResponse } from '@/types/quiz.types'

interface QuizCardProps {
  quiz: QuizHistoryResponse
}

export function QuizCard({ quiz }: QuizCardProps) {
  const t = useTranslations('QuizCard')
  const isCompleted = quiz.status === 'completed'

  return (
    <Card className="group overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-300 rounded-3xl p-5 bg-white flex flex-col h-full animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-2xl bg-warning/10 text-warning flex items-center justify-center group-hover:scale-110 transition-transform">
          <Target size={24} />
        </div>
        <Badge
          variant={isCompleted ? 'success' : 'warning'}
          className="px-3 py-1 text-[10px] uppercase tracking-wider font-bold"
        >
          {isCompleted ? t('statusCompleted') : t('statusPending')}
        </Badge>
      </div>

      <div className="mb-6 flex-1">
        <h4 className="font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 leading-snug mb-2">
          {quiz.module_title}
        </h4>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span>{quiz.num_questions} {t('questions')}</span>
          <span className="w-1 h-1 rounded-full bg-gray-200"></span>
          <span>
            {new Date(quiz.created_at).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
        <div>
          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">{t('score')}</p>
          <p className={`text-xl font-black ${isCompleted ? (quiz.score! >= 70 ? 'text-success' : 'text-danger') : 'text-gray-300'}`}>
            {quiz.score ?? '-'}{quiz.score !== null ? '%' : ''}
          </p>
        </div>

        <Link href={isCompleted ? `/quiz/${quiz.id}/result` : `/quiz/${quiz.id}`}>
          <Button
            variant={isCompleted ? 'ghost' : 'primary'}
            size="sm"
            className="rounded-xl font-bold px-4"
          >
            {isCompleted ? t('result') : t('continue')}
          </Button>
        </Link>
      </div>
    </Card>
  )
}
