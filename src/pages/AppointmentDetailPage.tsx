import type { ReactNode } from 'react'
import { Link as RouterLink, useParams } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

import { ErrorState } from '../components/common/ErrorState'
import { Loading } from '../components/common/Loading'
import { StatusChip } from '../components/common/StatusChip'
import { ROUTES } from '../constants'
import { useAppointment } from '../hooks/queries/useAppointments'
import { t } from '../i18n'
import { formatDateTime } from '../utils/date'

function DetailItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
        {label}
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: 500 }}>
        {value}
      </Typography>
    </Box>
  )
}

export function AppointmentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, isError, refetch, error } = useAppointment(id)

  if (isLoading) return <Loading />
  if (isError || !data) {
    return (
      <ErrorState
        message={error?.message || t('detail.notFound')}
        onRetry={() => void refetch()}
      />
    )
  }

  return (
    <Box sx={{ maxWidth: 900 }}>
      <Button
        component={RouterLink}
        to={ROUTES.appointments}
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
      >
        {t('common.back')}
      </Button>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          mb: 3,
        }}
      >
        <Typography variant="h4">{t('detail.title')}</Typography>
        <StatusChip status={data.status} />
      </Box>

      <Paper
        elevation={0}
        sx={{ p: { xs: 2, sm: 3 }, border: '1px solid', borderColor: 'divider' }}
      >
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <DetailItem label={t('detail.appointmentId')} value={data.id} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <DetailItem label={t('detail.status')} value={<StatusChip status={data.status} />} />
          </Grid>
          <Grid size={12}>
            <Divider />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <DetailItem label={t('detail.customer')} value={data.customerName} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <DetailItem label={t('detail.phone')} value={data.customerPhone} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <DetailItem label={t('detail.vehicle')} value={data.vehicleLabel} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <DetailItem label={t('detail.vin')} value={data.vin} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <DetailItem label={t('detail.serviceType')} value={data.serviceTypeName} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <DetailItem label={t('detail.technician')} value={data.technicianName} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <DetailItem label={t('detail.serviceBay')} value={data.serviceBayName} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <DetailItem
              label={t('detail.startTime')}
              value={formatDateTime(data.startTime)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <DetailItem
              label={t('detail.endTime')}
              value={formatDateTime(data.endTime)}
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}
