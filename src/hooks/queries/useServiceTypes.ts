import { useQuery } from '@tanstack/react-query'

import { MASTER_STALE_TIME } from '../../constants'
import { queryKeys } from '../../constants/queryKeys'
import { getServiceTypes } from '../../services/serviceType.service'

export function useServiceTypes() {
  return useQuery({
    queryKey: queryKeys.serviceTypes.all,
    queryFn: getServiceTypes,
    staleTime: MASTER_STALE_TIME,
  })
}
