import api from './api'
import type { APIResponse } from '@/types/api.types'
import type {
  QuizResponse,
  QuizResultResponse,
  QuizHistoryResponse,
  GenerateQuizRequest,
  SubmitQuizRequest,
} from '@/types/quiz.types'

export const quizService = {
  getAll: () => api.get<APIResponse<QuizHistoryResponse[]>>('/quiz'),
  getHistory: () => api.get<APIResponse<QuizHistoryResponse[]>>('/quiz/history'),

  generate: (data: GenerateQuizRequest) =>
    api.post<APIResponse<QuizResponse>>('/quiz', data),

  submit: (quizId: string, data: SubmitQuizRequest) =>
    api.post<APIResponse<QuizResultResponse>>(`/quiz/${quizId}/submit`, data),

  retry: (quizId: string) =>
    api.post<APIResponse<QuizResponse>>(`/quiz/${quizId}/retry`),

  getResult: (quizId: string) =>
    api.get<APIResponse<QuizResultResponse>>(`/quiz/${quizId}/result`),

  getHistoryByModule: (moduleId: string) =>
    api.get<APIResponse<QuizHistoryResponse[]>>(`/quiz/history/module/${moduleId}`),
}
