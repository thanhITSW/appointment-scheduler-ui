import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { t } from '../../i18n'

interface EmptyStateProps {
  message?: string
}

export function EmptyState({ message = t('common.empty') }: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        py: 6,
        color: 'text.secondary',
      }}
    >
      <InboxOutlinedIcon sx={{ fontSize: 40, opacity: 0.6 }} />
      <Typography variant="body1">{message}</Typography>
    </Box>
  )
}
