import type { CreateCustomerRequest, Customer } from '../types'
import { api } from './axios'

export async function searchCustomers(keyword = ''): Promise<Customer[]> {
  const { data } = await api.get<Customer[]>('/api/v1/public/customers', {
    params: keyword ? { keyword } : undefined,
  })
  return data
}

export async function createCustomer(
  payload: CreateCustomerRequest,
): Promise<Customer> {
  const { data } = await api.post<Customer>(
    '/api/v1/public/customers',
    payload,
  )
  return data
}

export async function getCustomer(id: number): Promise<Customer> {
  const { data } = await api.get<Customer>(`/api/v1/private/customers/${id}`)
  return data
}
