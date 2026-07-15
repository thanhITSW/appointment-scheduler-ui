import { useQuery } from '@tanstack/react-query'

import { MASTER_STALE_TIME } from '../../constants'
import { queryKeys } from '../../constants/queryKeys'
import { getDealerships } from '../../services/dealership.service'

export function useDealerships() {
  return useQuery({
    queryKey: queryKeys.dealerships.all,
    queryFn: getDealerships,
    staleTime: MASTER_STALE_TIME,
  })
}
