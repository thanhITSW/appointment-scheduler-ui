import { useQuery } from '@tanstack/react-query'

import { TRANSACTION_STALE_TIME } from '../../constants'
import { queryKeys } from '../../constants/queryKeys'
import {
  getAppointment,
  getAppointmentsList,
} from '../../services/appointment.service'
import type { AppointmentListParams } from '../../types'

export function useAppointments(params: AppointmentListParams = {}) {
  return useQuery({
    queryKey: [...queryKeys.appointments.all, params],
    queryFn: () => getAppointmentsList(params),
    staleTime: TRANSACTION_STALE_TIME,
  })
}

export function useAppointment(id: string | undefined) {
  const numericId = id ? Number(id) : NaN
  return useQuery({
    queryKey: queryKeys.appointments.detail(id ?? ''),
    queryFn: () => getAppointment(numericId),
    enabled: Number.isFinite(numericId),
    staleTime: TRANSACTION_STALE_TIME,
  })
}
