import Chip from '@mui/material/Chip'

import en from '../../i18n/en'
import { statusColors } from '../../theme'
import type { AppointmentStatus } from '../../types'

interface StatusChipProps {
  status: AppointmentStatus
}

export function StatusChip({ status }: StatusChipProps) {
  return (
    <Chip
      size="small"
      label={en.status[status]}
      color={statusColors[status] ?? 'default'}
      variant="filled"
    />
  )
}
