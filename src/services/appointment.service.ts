import type {
  Appointment,
  AppointmentListParams,
  AvailabilityRequest,
  AvailabilityResponse,
  CreateAppointmentRequest,
} from '../types'
import { api } from './axios'

export async function getAppointmentsList(
  params: AppointmentListParams = {},
): Promise<Appointment[]> {
  const { data } = await api.get<Appointment[]>('/api/v1/private/appointments', {
    params: {
      date: params.date,
      customerId: params.customerId,
      status: params.status,
      page: params.page ?? 0,
      size: params.size ?? 50,
      sort: params.sort ?? 'appointmentDate,desc',
    },
  })
  return data
}

export async function getAppointment(id: number): Promise<Appointment> {
  const { data } = await api.get<Appointment>(
    `/api/v1/private/appointments/${id}`,
  )
  return data
}

export async function checkAvailability(
  payload: AvailabilityRequest,
): Promise<AvailabilityResponse> {
  const { data } = await api.post<AvailabilityResponse>(
    '/api/v1/public/appointments/check-availability',
    payload,
  )
  return data
}

export async function createAppointment(
  payload: CreateAppointmentRequest,
): Promise<Appointment> {
  const { data } = await api.post<Appointment>(
    '/api/v1/public/appointments',
    payload,
  )
  return data
}

export async function updateAppointmentStatus(
  id: number,
  status: Appointment['status'],
): Promise<Appointment> {
  const { data } = await api.patch<Appointment>(
    `/api/v1/private/appointments/${id}/status`,
    { status },
  )
  return data
}

export async function cancelAppointment(id: number): Promise<Appointment> {
  const { data } = await api.post<Appointment>(
    `/api/v1/private/appointments/${id}/cancel`,
  )
  return data
}

export async function rescheduleAppointment(
  id: number,
  payload: { appointmentDate: string; startTime: string },
): Promise<Appointment> {
  const { data } = await api.put<Appointment>(
    `/api/v1/private/appointments/${id}/reschedule`,
    payload,
  )
  return data
}
