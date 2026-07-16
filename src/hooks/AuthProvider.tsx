import { useCallback, useMemo, useState, type ReactNode } from 'react'

import { AUTH_STORAGE_KEY } from '../constants'
import {
  login as loginRequest,
  logout as logoutRequest,
} from '../services/auth.service'
import type { LoginRequest } from '../types'
import { AuthContext, type AuthSession } from './authContext'

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
    const authenticated =
      result.authenticated === true || result.isAuthenticated === true
    if (!authenticated || !result.jwtTokenDto?.token) {
      throw new Error('Login failed')
    }
    const jwt = result.jwtTokenDto
    const next: AuthSession = {
      token: jwt.token,
      refreshToken: jwt.refreshToken,
      expiredTime: jwt.expiredTime,
      user: {
        userId: jwt.userId,
        employeeId: jwt.employeeId,
        username: jwt.username,
      },
    }
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(next))
    setSession(next)
  }, [])

  const logout = useCallback(async () => {
    try {
      await logoutRequest()
    } catch {
      // Still clear local session if API logout fails
    }
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
