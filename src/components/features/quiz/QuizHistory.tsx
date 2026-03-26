import * as React from 'react'
import { QuizCard } from './QuizCard'
import type { QuizHistoryResponse } from '@/types/quiz.types'

interface QuizHistoryProps {
  quizzes: QuizHistoryResponse[]
}

export function QuizHistory({ quizzes }: QuizHistoryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {quizzes.map((quiz, i) => (
        <div 
          key={quiz.id} 
          className="animate-in fade-in slide-in-from-bottom-4 duration-500"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <QuizCard quiz={quiz} />
        </div>
      ))}
    </div>
  )
}
