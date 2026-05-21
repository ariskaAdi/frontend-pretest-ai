import api from './api'
import type { APIResponse } from '@/types/api.types'
import type {
  User,
  UpdateEmailRequest,
  VerifyUpdateEmailRequest,
  RequestUpdatePasswordRequest,
  VerifyUpdatePasswordRequest,
} from '@/types/auth.types'

export const userService = {
  getMe: () => api.get<APIResponse<User>>('/user/me'),
  requestEmailUpdate: (data: UpdateEmailRequest) =>
    api.post<APIResponse<null>>('/user/email/request-update', data),
  verifyEmailUpdate: (data: VerifyUpdateEmailRequest) =>
    api.post<APIResponse<null>>('/user/email/verify-update', data),
  requestPasswordUpdate: (data: RequestUpdatePasswordRequest) =>
    api.post<APIResponse<null>>('/user/password/request-update', data),
  verifyPasswordUpdate: (data: VerifyUpdatePasswordRequest) =>
    api.post<APIResponse<null>>('/user/password/verify-update', data),
}
