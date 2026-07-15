import { delay, serviceBays } from '../mocks/db'
import type { ServiceBay } from '../types'
import { isStubMode } from '../utils'
import { api } from './axios'

export async function getServiceBays(): Promise<ServiceBay[]> {
  if (isStubMode()) {
    await delay()
    return [...serviceBays]
  }
  const { data } = await api.get<ServiceBay[]>('/service-bays')
  return data
}
