import { delay, technicians } from '../mocks/db'
import type { Technician } from '../types'
import { isStubMode } from '../utils'
import { api } from './axios'

export async function getTechnicians(): Promise<Technician[]> {
  if (isStubMode()) {
    await delay()
    return [...technicians]
  }
  const { data } = await api.get<Technician[]>('/technicians')
  return data
}
