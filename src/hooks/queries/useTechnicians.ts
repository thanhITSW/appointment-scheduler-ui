import { useQuery } from '@tanstack/react-query'

import { MASTER_STALE_TIME } from '../../constants'
import { queryKeys } from '../../constants/queryKeys'
import { getTechnicians } from '../../services/technician.service'

export function useTechnicians(enabled = true) {
  return useQuery({
    queryKey: queryKeys.technicians.all,
    queryFn: getTechnicians,
    staleTime: MASTER_STALE_TIME,
    enabled,
    retry: false,
  })
}
