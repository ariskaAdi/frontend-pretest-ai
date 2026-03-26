'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { quizService } from '@/services/quizService'
import type { GenerateQuizRequest, SubmitQuizRequest } from '@/types/quiz.types'

const QUIZ_KEYS = {
  all: ['quizzes'],
  history: ['quizzes', 'history'],
  historyByModule: (moduleId: string) => ['quizzes', 'history', 'module', moduleId],
  session: (id: string) => ['quiz', 'session', id],
  result: (id: string) => ['quiz', 'result', id],
}

export function useQuizQuery() {
  return useQuery({
    queryKey: QUIZ_KEYS.all,
    queryFn: async () => {
      const res = await quizService.getAll()
      return res.data.data
    },
  })
}

export function useQuizHistoryQuery() {
  return useQuery({
    queryKey: QUIZ_KEYS.history,
    queryFn: async () => {
      const res = await quizService.getHistory()
      return res.data.data
    },
  })
}

export function useQuizResultQuery(quizId: string) {
  return useQuery({
    queryKey: QUIZ_KEYS.result(quizId),
    queryFn: async () => {
      const res = await quizService.getResult(quizId)
      return res.data.data
    },
    enabled: !!quizId,
  })
}

export function useQuizHistoryByModuleQuery(moduleId: string) {
  return useQuery({
    queryKey: QUIZ_KEYS.historyByModule(moduleId),
    queryFn: async () => {
      const res = await quizService.getHistoryByModule(moduleId)
      return res.data.data
    },
    enabled: !!moduleId,
  })
}

export function useGenerateQuizMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: GenerateQuizRequest) => quizService.generate(data),
    onSuccess: (res) => {
      const quiz = res.data.data
      queryClient.setQueryData(QUIZ_KEYS.session(quiz.id), quiz)
      queryClient.invalidateQueries({ queryKey: QUIZ_KEYS.history })
    },
  })
}

export function useSubmitQuizMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ quizId, data }: { quizId: string; data: SubmitQuizRequest }) =>
      quizService.submit(quizId, data),
    onSuccess: (res, { quizId }) => {
      const result = res.data.data
      queryClient.setQueryData(QUIZ_KEYS.result(quizId), result)
      queryClient.invalidateQueries({ queryKey: QUIZ_KEYS.history })
    },
  })
}

export function useRetryQuizMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (quizId: string) => quizService.retry(quizId),
    onSuccess: (res) => {
      const quiz = res.data.data
      queryClient.setQueryData(QUIZ_KEYS.session(quiz.id), quiz)
      queryClient.invalidateQueries({ queryKey: QUIZ_KEYS.history })
    },
  })
}
