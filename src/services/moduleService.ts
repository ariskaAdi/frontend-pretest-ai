import api from './api'
import type { APIResponse } from '@/types/api.types'
import type { Module, ModuleDetail, UpdateSummaryRequest, SummaryResponse } from '@/types/module.types'

export const moduleService = {
  upload: (data: FormData) =>
    api.post<APIResponse<Module>>('/modules', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  getAll: () =>
    api.get<APIResponse<Module[]>>('/modules'),

  getById: (id: string) =>
    api.get<APIResponse<ModuleDetail>>(`/modules/${id}`),

  remove: (id: string) =>
    api.delete<APIResponse<null>>(`/modules/${id}`),

  getSummary: (moduleId: string) =>
    api.get<APIResponse<SummaryResponse>>(`/summary/${moduleId}`),

  updateSummary: (moduleId: string, data: UpdateSummaryRequest) =>
    api.put<APIResponse<SummaryResponse>>(`/summary/${moduleId}`, data),

  retrySummarize: (id: string) =>
    api.post<APIResponse<null>>(`/modules/${id}/retry-summarize`),
}
