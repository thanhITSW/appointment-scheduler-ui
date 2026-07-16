import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '../../constants/queryKeys'
import { createAppointment } from '../../services/appointment.service'
import type { CreateAppointmentRequest } from '../../types'

export function useCreateAppointment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateAppointmentRequest) => createAppointment(payload),
    onSuccess: (appointment) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all })
      void queryClient.invalidateQueries({ queryKey: queryKeys.customers.all })
      void queryClient.invalidateQueries({
        queryKey: queryKeys.vehicles.byCustomer(String(appointment.customerId)),
      })
      queryClient.setQueryData(
        queryKeys.appointments.detail(String(appointment.id)),
        appointment,
      )
    },
  })
}
