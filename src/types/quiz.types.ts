export interface QuizQuestion {
  id: string
  text: string
  options: string[] // ["A. ...", "B. ...", "C. ...", "D. ..."]
}

export interface QuizQuestionResult extends QuizQuestion {
  correct_answer: string // "A" | "B" | "C" | "D"
  user_answer: string
  is_correct: boolean
}

export interface QuizResponse {
  id: string
  module_id: string
  module_title: string
  num_questions: number
  status: 'pending' | 'completed'
  questions: QuizQuestion[]
  created_at: string
}

export interface QuizResultResponse {
  id: string
  module_id: string
  module_title: string
  num_questions: number
  score: number
  status: 'completed'
  questions: QuizQuestionResult[]
  created_at: string
}

export interface QuizHistoryResponse {
  id: string
  module_id: string
  module_title: string
  num_questions: number
  score: number | null // null jika belum di-submit
  status: 'pending' | 'completed'
  created_at: string
}

export interface GenerateQuizRequest {
  module_id: string
  num_questions: 5 | 10 | 20
}

export interface SubmitAnswer {
  question_id: string
  answer: 'A' | 'B' | 'C' | 'D'
}

export interface SubmitQuizRequest {
  answers: SubmitAnswer[]
}
