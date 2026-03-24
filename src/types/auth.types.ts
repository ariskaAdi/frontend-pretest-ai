export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'member' | 'guest'
  is_verified: boolean
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface VerifyOTPRequest {
  email: string
  otp: string
}

export interface UpdateEmailRequest {
  new_email: string
}

export interface VerifyUpdateEmailRequest {
  new_email: string
  otp: string
}

export interface LoginResponse {
  token: string
  user: User
}
