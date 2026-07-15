import { useQuery } from '@tanstack/react-query'

import { MASTER_STALE_TIME } from '../../constants'
import { queryKeys } from '../../constants/queryKeys'
import { getCustomers } from '../../services/customer.service'

export function useCustomers() {
  return useQuery({
    queryKey: queryKeys.customers.all,
    queryFn: getCustomers,
    staleTime: MASTER_STALE_TIME,
  })
}
