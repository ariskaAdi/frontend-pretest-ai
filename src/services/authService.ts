import api from './api'
import type {
  LoginRequest,
  RegisterRequest,
  VerifyOTPRequest,
  UpdateEmailRequest,
  VerifyUpdateEmailRequest,
  LoginResponse,
} from '@/types/auth.types'
import type { APIResponse } from '@/types/api.types'

export const authService = {
  register: (data: RegisterRequest) =>
    api.post<APIResponse>('/auth/register', data),

  verifyOTP: (data: VerifyOTPRequest) =>
    api.post<APIResponse>('/auth/verify-otp', data),

  login: (data: LoginRequest) =>
    api.post<APIResponse<LoginResponse>>('/auth/login', data),

  logout: () =>
    api.post<APIResponse>('/auth/logout'),

  requestUpdateEmail: (data: UpdateEmailRequest) =>
    api.post<APIResponse>('/user/email/request-update', data),

  verifyUpdateEmail: (data: VerifyUpdateEmailRequest) =>
    api.post<APIResponse>('/user/email/verify-update', data),
}
