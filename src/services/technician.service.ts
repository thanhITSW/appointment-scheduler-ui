import type { Technician } from '../types'
import { api } from './axios'

export async function getTechnicians(): Promise<Technician[]> {
  const { data } = await api.get<Technician[]>('/api/v1/private/technicians')
  return data
}
