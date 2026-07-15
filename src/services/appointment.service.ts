import {
  checkAvailabilityStub,
  createAppointmentStub,
  delay,
  getAppointmentById,
  getAppointments,
} from '../mocks/db'
import type {
  Appointment,
  AvailabilityRequest,
  AvailabilityResponse,
  CreateAppointmentRequest,
} from '../types'
import { isStubMode } from '../utils'
import { api } from './axios'

export async function getAppointmentsList(): Promise<Appointment[]> {
  if (isStubMode()) {
    await delay()
    return getAppointments()
  }
  const { data } = await api.get<Appointment[]>('/appointments')
  return data
}

export async function getAppointment(id: string): Promise<Appointment> {
  if (isStubMode()) {
    await delay()
    const appointment = getAppointmentById(id)
    if (!appointment) {
      throw new Error('Appointment not found')
    }
    return appointment
  }
  const { data } = await api.get<Appointment>(`/appointments/${id}`)
  return data
}

export async function checkAvailability(
  payload: AvailabilityRequest,
): Promise<AvailabilityResponse> {
  if (isStubMode()) {
    await delay(500)
    return checkAvailabilityStub(payload)
  }
  const { data } = await api.post<AvailabilityResponse>('/availability', payload)
  return data
}

export async function createAppointment(
  payload: CreateAppointmentRequest,
): Promise<Appointment> {
  if (isStubMode()) {
    await delay(500)
    return createAppointmentStub(payload)
  }
  const { data } = await api.post<Appointment>('/appointments', payload)
  return data
}
