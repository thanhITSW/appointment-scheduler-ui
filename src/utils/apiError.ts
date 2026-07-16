import { translateMessageCode } from '../i18n'
import type { ApiErrorBody } from '../types'

export class ApiError extends Error {
  readonly messageCode?: string
  readonly status?: number

  constructor(message: string, messageCode?: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.messageCode = messageCode
    this.status = status
  }
}

export { translateMessageCode }

export function getApiErrorMessage(
  error: unknown,
  fallback?: string,
): string {
  if (error instanceof ApiError) {
    return error.message || translateMessageCode(undefined, fallback)
  }

  if (error instanceof Error) {
    const code = (error as Error & { messageCode?: string }).messageCode
    if (code) return translateMessageCode(code, fallback)
    return error.message || translateMessageCode(undefined, fallback)
  }

  if (error && typeof error === 'object' && 'messageCode' in error) {
    const body = error as ApiErrorBody
    return translateMessageCode(body.messageCode, fallback)
  }

  return translateMessageCode(undefined, fallback)
}
