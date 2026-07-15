import { useMutation } from '@tanstack/react-query'

import { checkAvailability } from '../services/appointment.service'
import type { AvailabilityRequest } from '../types'

export function useCheckAvailability() {
  return useMutation({
    mutationFn: (payload: AvailabilityRequest) => checkAvailability(payload),
    gcTime: 0,
  })
}
