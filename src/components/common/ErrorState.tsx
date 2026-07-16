import ErrorOutlinedIcon from '@mui/icons-material/ErrorOutlined'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import { t } from '../../i18n'

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export function ErrorState({
  message = t('common.error'),
  onRetry,
}: ErrorStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.5,
        py: 6,
        color: 'error.main',
      }}
    >
      <ErrorOutlinedIcon sx={{ fontSize: 40 }} />
      <Typography variant="body1">{message}</Typography>
      {onRetry ? (
        <Button variant="outlined" color="error" onClick={onRetry}>
          {t('common.retry')}
        </Button>
      ) : null}
    </Box>
  )
}
