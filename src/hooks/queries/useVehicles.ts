import { useQuery } from '@tanstack/react-query'

import { MASTER_STALE_TIME } from '../../constants'
import { queryKeys } from '../../constants/queryKeys'
import { getVehiclesByCustomer } from '../../services/vehicle.service'

export function useVehicles(customerId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.vehicles.byCustomer(customerId ?? ''),
    queryFn: () => getVehiclesByCustomer(customerId!),
    enabled: Boolean(customerId),
    staleTime: MASTER_STALE_TIME,
  })
}
