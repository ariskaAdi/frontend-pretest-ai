export interface Module {
  id: string
  title: string
  file_url: string
  is_summarized: boolean
  summarize_failed: boolean
  created_at: string
}

export interface ModuleDetail extends Module {
  summary: string
}

export interface UploadModuleRequest {
  title: string
  file: File
}

export interface UpdateSummaryRequest {
  summary: string
}

export interface SummaryResponse {
  module_id: string
  module_title: string
  summary: string
  is_summarized: boolean
  summarize_failed: boolean
  updated_at: string
}
