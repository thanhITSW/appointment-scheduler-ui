import { useQuery } from '@tanstack/react-query'

import { MASTER_STALE_TIME } from '../../constants'
import { queryKeys } from '../../constants/queryKeys'
import { searchCustomers } from '../../services/customer.service'

export function useCustomers(keyword = '') {
  return useQuery({
    queryKey: [...queryKeys.customers.all, keyword],
    queryFn: () => searchCustomers(keyword),
    staleTime: MASTER_STALE_TIME,
  })
}
