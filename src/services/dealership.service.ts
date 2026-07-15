import { dealerships, delay } from '../mocks/db'
import type { Dealership } from '../types'
import { isStubMode } from '../utils'
import { api } from './axios'

export async function getDealerships(): Promise<Dealership[]> {
  if (isStubMode()) {
    await delay()
    return [...dealerships]
  }
  const { data } = await api.get<Dealership[]>('/dealerships')
  return data
}
