import type { ServiceBay } from '../types'
import { api } from './axios'

export async function getServiceBays(): Promise<ServiceBay[]> {
  const { data } = await api.get<ServiceBay[]>(
    '/api/v1/private/service-bays',
  )
  return data
}
