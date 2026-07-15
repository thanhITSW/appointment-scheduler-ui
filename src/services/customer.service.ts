import { customers, delay } from '../mocks/db'
import type { Customer } from '../types'
import { isStubMode } from '../utils'
import { api } from './axios'

export async function getCustomers(): Promise<Customer[]> {
  if (isStubMode()) {
    await delay()
    return [...customers]
  }
  const { data } = await api.get<Customer[]>('/customers')
  return data
}
