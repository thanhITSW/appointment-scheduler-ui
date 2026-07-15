import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import { AUTH_STORAGE_KEY } from '../constants'
import { login as loginRequest } from '../services/auth.service'
import type { AuthUser, LoginRequest } from '../types'
import { AuthContext } from './authContext'

interface AuthSession {
  token: string
  user: AuthUser
}

function readSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AuthSession
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(() => readSession())

  const login = useCallback(async (payload: LoginRequest) => {
    const result = await loginRequest(payload)
    const next: AuthSession = { token: result.token, user: result.user }
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(next))
    setSession(next)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    setSession(null)
  }, [])

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      token: session?.token ?? null,
      isAuthenticated: Boolean(session?.token),
      login,
      logout,
    }),
    [session, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
