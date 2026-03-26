import api from './api'
import type { APIResponse } from '@/types/api.types'
import type { User } from '@/types/auth.types'

export const userService = {
  getMe: () => api.get<APIResponse<User>>('/user/me'),
}
