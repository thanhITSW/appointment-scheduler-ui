import axios, { type AxiosError } from 'axios'

import { AUTH_STORAGE_KEY } from '../constants'
import type { ApiErrorBody } from '../types'
import { ApiError, translateMessageCode } from '../utils/apiError'

interface StoredAuth {
  token: string
  refreshToken?: string
}

function readToken(): string | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as StoredAuth
    return parsed.token ?? null
  } catch {
    return null
  }
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = readToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => {
    const messageCode = error.response?.data?.messageCode
    const message = translateMessageCode(
      messageCode,
      error.response ? undefined : error.message,
    )

    return Promise.reject(
      new ApiError(message, messageCode, error.response?.status),
    )
  },
)
