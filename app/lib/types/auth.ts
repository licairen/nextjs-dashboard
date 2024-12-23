import { UserWithoutPassword } from './user'

export interface AuthResponse {
  success: boolean
  message: string
  code: number
  user?: UserWithoutPassword
  token?: string
}

export interface TokenPayload {
  userId: string
  email: string
}

export interface VerifyEmailInput {
  email: string
  token: string
}
