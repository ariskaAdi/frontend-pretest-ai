'use client'

import * as React from 'react'
import { Card } from '@/components/shared/Card'
import type { QuizQuestion as IQuizQuestion } from '@/types/quiz.types'

interface QuizQuestionProps {
  question: IQuizQuestion
  selectedAnswer?: string
  onSelect: (answer: 'A' | 'B' | 'C' | 'D') => void
  questionNumber: number
  totalQuestions: number
}

const OPTION_LABELS = ['A', 'B', 'C', 'D'] as const

export function QuizQuestion({ 
  question, 
  selectedAnswer, 
  onSelect, 
  questionNumber, 
  totalQuestions 
}: QuizQuestionProps) {
  const progress = (questionNumber / totalQuestions) * 100

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Progress Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm font-bold">
          <span className="text-gray-900 uppercase tracking-wider">Pertanyaan {questionNumber} dari {totalQuestions}</span>
          <span className="text-primary">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <Card className="p-8 border-none shadow-sm rounded-3xl bg-white">
        <h3 className="text-xl font-bold text-gray-900 leading-relaxed mb-8">
          {question.text}
        </h3>

        <div className="space-y-4">
          {question.options.map((option, index) => {
            const label = OPTION_LABELS[index]
            const isSelected = selectedAnswer === label

            return (
              <button
                key={label}
                onClick={() => onSelect(label)}
                className={`
                  w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 flex items-start gap-4 group
                  ${isSelected 
                    ? 'border-primary bg-primary-light ring-4 ring-primary/5' 
                    : 'border-gray-50 bg-gray-50 hover:border-gray-200 hover:bg-white'}
                `}
              >
                <div className={`
                  w-8 h-8 rounded-xl flex items-center justify-center font-black flex-shrink-0 transition-colors
                  ${isSelected ? 'bg-primary text-white' : 'bg-white text-gray-400 border border-gray-100 group-hover:text-primary group-hover:border-primary'}
                `}>
                  {label}
                </div>
                <span className={`
                  font-bold leading-relaxed pt-0.5 transition-colors
                  ${isSelected ? 'text-primary' : 'text-gray-600 group-hover:text-gray-900'}
                `}>
                  {option.replace(/^[A-D]\.\s*/, '')}
                </span>
              </button>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
