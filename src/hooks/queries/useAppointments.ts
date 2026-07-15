import { useQuery } from '@tanstack/react-query'

import { TRANSACTION_STALE_TIME } from '../../constants'
import { queryKeys } from '../../constants/queryKeys'
import { getAppointment, getAppointmentsList } from '../../services/appointment.service'

export function useAppointments() {
  return useQuery({
    queryKey: queryKeys.appointments.all,
    queryFn: getAppointmentsList,
    staleTime: TRANSACTION_STALE_TIME,
  })
}

export function useAppointment(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.appointments.detail(id ?? ''),
    queryFn: () => getAppointment(id!),
    enabled: Boolean(id),
    staleTime: TRANSACTION_STALE_TIME,
  })
}
