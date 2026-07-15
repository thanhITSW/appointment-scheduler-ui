import { delay, serviceTypes } from '../mocks/db'
import type { ServiceType } from '../types'
import { isStubMode } from '../utils'
import { api } from './axios'

export async function getServiceTypes(): Promise<ServiceType[]> {
  if (isStubMode()) {
    await delay()
    return [...serviceTypes]
  }
  const { data } = await api.get<ServiceType[]>('/service-types')
  return data
}
