import type { Dealership } from '../types'
import { api } from './axios'

export async function getDealerships(): Promise<Dealership[]> {
  const { data } = await api.get<Dealership[]>('/api/v1/public/dealerships')
  return data
}
