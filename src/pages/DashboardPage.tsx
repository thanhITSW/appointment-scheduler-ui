import type { ReactNode } from 'react'
import dayjs from 'dayjs'
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined'
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined'
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined'
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import { AppTable, type AppTableColumn } from '../components/common/AppTable'
import { ErrorState } from '../components/common/ErrorState'
import { Loading } from '../components/common/Loading'
import { StatusChip } from '../components/common/StatusChip'
import { useAppointments } from '../hooks/queries/useAppointments'
import { useServiceBays } from '../hooks/queries/useServiceBays'
import { useTechnicians } from '../hooks/queries/useTechnicians'
import { t } from '../i18n'
import type { Appointment } from '../types'
import { formatTime, isSameDay } from '../utils/date'

interface StatCardProps {
  title: string
  value: number
  icon: ReactNode
  accent: string
}

function StatCard({ title, value, icon, accent }: StatCardProps) {
  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        border: '1px solid',
        borderColor: 'divider',
        background: `linear-gradient(135deg, #FFFFFF 0%, ${accent}12 100%)`,
      }}
    >
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            display: 'grid',
            placeItems: 'center',
            bgcolor: `${accent}18`,
            color: accent,
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h4">{value}</Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export function DashboardPage() {
  const appointmentsQuery = useAppointments()
  const techniciansQuery = useTechnicians()
  const baysQuery = useServiceBays()

  const isLoading =
    appointmentsQuery.isLoading ||
    techniciansQuery.isLoading ||
    baysQuery.isLoading
  const isError =
    appointmentsQuery.isError || techniciansQuery.isError || baysQuery.isError

  if (isLoading) return <Loading />
  if (isError) {
    return (
      <ErrorState
        onRetry={() => {
          void appointmentsQuery.refetch()
          void techniciansQuery.refetch()
          void baysQuery.refetch()
        }}
      />
    )
  }

  const appointments = appointmentsQuery.data ?? []
  const todayAppointments = appointments.filter((item) => isSameDay(item.startTime))
  const completedToday = todayAppointments.filter(
    (item) => item.status === 'completed',
  ).length
  const availableTechnicians =
    techniciansQuery.data?.filter((item) => item.available).length ?? 0
  const availableBays =
    baysQuery.data?.filter((item) => item.available).length ?? 0

  const upcoming = [...appointments]
    .filter(
      (item) =>
        item.status === 'scheduled' || item.status === 'in_progress',
    )
    .sort((a, b) => dayjs(a.startTime).valueOf() - dayjs(b.startTime).valueOf())
    .slice(0, 8)

  const columns: AppTableColumn<Appointment>[] = [
    {
      id: 'time',
      label: t('dashboard.columns.time'),
      render: (row) => formatTime(row.startTime),
    },
    {
      id: 'customer',
      label: t('dashboard.columns.customer'),
      render: (row) => row.customerName,
    },
    {
      id: 'vehicle',
      label: t('dashboard.columns.vehicle'),
      render: (row) => row.vehicleLabel,
    },
    {
      id: 'technician',
      label: t('dashboard.columns.technician'),
      render: (row) => row.technicianName,
    },
    {
      id: 'status',
      label: t('dashboard.columns.status'),
      render: (row) => <StatusChip status={row.status} />,
    },
  ]

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        {t('dashboard.title')}
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title={t('dashboard.todayAppointments')}
            value={todayAppointments.length}
            icon={<EventAvailableOutlinedIcon />}
            accent="#1B4F72"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title={t('dashboard.availableTechnicians')}
            value={availableTechnicians}
            icon={<BuildOutlinedIcon />}
            accent="#0369A1"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title={t('dashboard.availableBays')}
            value={availableBays}
            icon={<DirectionsCarFilledOutlinedIcon />}
            accent="#D97706"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title={t('dashboard.completedToday')}
            value={completedToday}
            icon={<TaskAltOutlinedIcon />}
            accent="#15803D"
          />
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ mb: 1.5 }}>
        {t('dashboard.upcoming')}
      </Typography>
      <AppTable
        columns={columns}
        rows={upcoming}
        getRowId={(row) => row.id}
      />
    </Box>
  )
}
