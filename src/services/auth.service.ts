import { DEMO_CREDENTIALS } from '../constants'
import { delay } from '../mocks/db'
import type { LoginRequest, LoginResponse } from '../types'
import { isStubMode } from '../utils'
import { api } from './axios'

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  if (isStubMode()) {
    await delay(400)
    const email = payload.email.trim().toLowerCase()
    const valid =
      email === DEMO_CREDENTIALS.email &&
      payload.password === DEMO_CREDENTIALS.password

    if (!valid) {
      throw new Error('Invalid email or password')
    }

    return {
      token: `stub-token-${Date.now()}`,
      user: {
        id: 'u1',
        name: 'Service Advisor',
        email: DEMO_CREDENTIALS.email,
        role: 'service_advisor',
      },
    }
  }

  const { data } = await api.post<LoginResponse>('/auth/login', payload)
  return data
}
