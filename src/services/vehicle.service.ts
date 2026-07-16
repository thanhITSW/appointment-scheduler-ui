import type { CreateVehicleRequest, Vehicle } from '../types'
import { api } from './axios'

export async function getVehiclesByCustomer(
  customerId: number,
): Promise<Vehicle[]> {
  const { data } = await api.get<Vehicle[]>(
    `/api/v1/public/customers/${customerId}/vehicles`,
  )
  return data
}

export async function createVehicle(
  customerId: number,
  payload: CreateVehicleRequest,
): Promise<Vehicle> {
  const { data } = await api.post<Vehicle>(
    `/api/v1/public/customers/${customerId}/vehicles`,
    payload,
  )
  return data
}
