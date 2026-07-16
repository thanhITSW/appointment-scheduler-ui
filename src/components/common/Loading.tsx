import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

import { t } from '../../i18n'

interface LoadingProps {
  label?: string
  minHeight?: number | string
}

export function Loading({ label = t('common.loading'), minHeight = 240 }: LoadingProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.5,
        minHeight,
        color: 'text.secondary',
      }}
    >
      <CircularProgress size={36} />
      <Typography variant="body2">{label}</Typography>
    </Box>
  )
}
