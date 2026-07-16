import { api } from './axios'
import type { LoginRequest, LoginResponse, RefreshTokenResponse } from '../types'

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>(
    '/api/v1/public/auth/login',
    payload,
  )
  return data
}

export async function refreshToken(
  refreshTokenValue: string,
): Promise<RefreshTokenResponse> {
  const { data } = await api.post<RefreshTokenResponse>(
    '/api/v1/public/auth/refresh',
    { refreshToken: refreshTokenValue },
  )
  return data
}

export async function logout(): Promise<void> {
  await api.post('/api/v1/public/auth/logout')
}
