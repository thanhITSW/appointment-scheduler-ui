import { createContext, useContext } from 'react'

import type { AuthUser, LoginRequest } from '../types'

export interface AuthSession {
  token: string
  refreshToken: string
  expiredTime: string
  user: AuthUser
}

export interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  login: (payload: LoginRequest) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
