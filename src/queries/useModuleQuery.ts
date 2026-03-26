'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { moduleService } from '@/services/moduleService'
import type { UpdateSummaryRequest } from '@/types/module.types'

const MODULE_KEYS = {
  all: ['modules'],
  detail: (id: string) => ['modules', id],
  summary: (id: string) => ['summary', id],
}

export function useModulesQuery() {
  return useQuery({
    queryKey: MODULE_KEYS.all,
    queryFn: async () => {
      const res = await moduleService.getAll()
      return res.data.data
    },
    refetchInterval: (query) =>
      query.state.data?.some((m: any) => !m.is_summarized && !m.summarize_failed) ? 5000 : false,
  })
}

export function useModuleDetailQuery(id: string) {
  return useQuery({
    queryKey: MODULE_KEYS.detail(id),
    queryFn: async () => {
      const res = await moduleService.getById(id)
      return res.data.data
    },
    enabled: !!id,
    refetchInterval: (query) =>
      query.state.data && !query.state.data.is_summarized && !query.state.data.summarize_failed ? 5000 : false,
  })
}

export function useSummaryQuery(moduleId: string, enabled: boolean) {
  return useQuery({
    queryKey: MODULE_KEYS.summary(moduleId),
    queryFn: async () => {
      const res = await moduleService.getSummary(moduleId)
      return res.data.data
    },
    enabled: !!moduleId && enabled,
    retry: false,
  })
}

export function useUploadModuleMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: FormData) => moduleService.upload(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MODULE_KEYS.all })
    },
  })
}

export function useDeleteModuleMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => moduleService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MODULE_KEYS.all })
    },
  })
}

export function useUpdateSummaryMutation(moduleId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateSummaryRequest) =>
      moduleService.updateSummary(moduleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MODULE_KEYS.summary(moduleId) })
    },
  })
}

export function useRetrySummarizeMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => moduleService.retrySummarize(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: MODULE_KEYS.all })
      queryClient.invalidateQueries({ queryKey: MODULE_KEYS.detail(id) })
    },
  })
}

