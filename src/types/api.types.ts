export interface APIResponse<T = unknown> {
  success: boolean
  message: string
  data: T
  error?: string
}

export interface APIError {
  response?: {
    status: number
    data: APIResponse<null>
  }
  message: string
}
