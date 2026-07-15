import { useQuery } from '@tanstack/react-query'

import { MASTER_STALE_TIME } from '../../constants'
import { queryKeys } from '../../constants/queryKeys'
import { getVehiclesByCustomer } from '../../services/vehicle.service'

export function useVehicles(customerId: number | undefined) {
  return useQuery({
    queryKey: queryKeys.vehicles.byCustomer(String(customerId ?? '')),
    queryFn: () => getVehiclesByCustomer(customerId!),
    enabled: typeof customerId === 'number' && Number.isFinite(customerId),
    staleTime: MASTER_STALE_TIME,
  })
}
