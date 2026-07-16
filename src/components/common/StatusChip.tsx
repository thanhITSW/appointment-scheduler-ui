import Chip from '@mui/material/Chip'

import { getDictionary } from '../../i18n'
import { statusColors } from '../../theme'
import type { AppointmentStatus } from '../../types'

interface StatusChipProps {
  status: AppointmentStatus
}

export function StatusChip({ status }: StatusChipProps) {
  const dict = getDictionary()
  return (
    <Chip
      size="small"
      label={dict.status[status] ?? status}
      color={statusColors[status] ?? 'default'}
      variant="filled"
    />
  )
}
