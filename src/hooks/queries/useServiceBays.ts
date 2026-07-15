import { useQuery } from '@tanstack/react-query'

import { MASTER_STALE_TIME } from '../../constants'
import { queryKeys } from '../../constants/queryKeys'
import { getServiceBays } from '../../services/serviceBay.service'

export function useServiceBays() {
  return useQuery({
    queryKey: queryKeys.serviceBays.all,
    queryFn: getServiceBays,
    staleTime: MASTER_STALE_TIME,
  })
}
