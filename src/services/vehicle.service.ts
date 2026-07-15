import { delay, vehicles } from '../mocks/db'
import type { Vehicle } from '../types'
import { isStubMode } from '../utils'
import { api } from './axios'

export async function getVehiclesByCustomer(
  customerId: string,
): Promise<Vehicle[]> {
  if (isStubMode()) {
    await delay()
    return vehicles.filter((vehicle) => vehicle.customerId === customerId)
  }
  const { data } = await api.get<Vehicle[]>(`/customers/${customerId}/vehicles`)
  return data
}
