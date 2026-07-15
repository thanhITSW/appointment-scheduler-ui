import type { ServiceType } from '../types'
import { api } from './axios'

export async function getServiceTypes(): Promise<ServiceType[]> {
  const { data } = await api.get<ServiceType[]>(
    '/api/v1/public/service-types',
  )
  return data
}
