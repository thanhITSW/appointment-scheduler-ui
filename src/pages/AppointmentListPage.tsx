import { useMemo, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import dayjs from 'dayjs'
import AddIcon from '@mui/icons-material/Add'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

import { AppTable, type AppTableColumn } from '../components/common/AppTable'
import { ErrorState } from '../components/common/ErrorState'
import { Loading } from '../components/common/Loading'
import { StatusChip } from '../components/common/StatusChip'
import { APPOINTMENT_STATUSES, ROUTES } from '../constants'
import { useAppointments } from '../hooks/queries/useAppointments'
import en from '../i18n/en'
import { t } from '../i18n'
import type { Appointment, AppointmentStatus } from '../types'
import { formatDateTime } from '../utils/date'

export function AppointmentListPage() {
  const { data, isLoading, isError, refetch } = useAppointments()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<AppointmentStatus | 'all'>('all')
  const [date, setDate] = useState<dayjs.Dayjs | null>(null)

  const filtered = useMemo(() => {
    const rows = data ?? []
    return rows.filter((item) => {
      const matchesSearch = item.customerName
        .toLowerCase()
        .includes(search.trim().toLowerCase())
      const matchesStatus = status === 'all' || item.status === status
      const matchesDate = !date || dayjs(item.startTime).isSame(date, 'day')
      return matchesSearch && matchesStatus && matchesDate
    })
  }, [data, search, status, date])

  const columns: AppTableColumn<Appointment>[] = [
    {
      id: 'customer',
      label: t('appointments.columns.customer'),
      minWidth: 140,
      render: (row) => row.customerName,
    },
    {
      id: 'vehicle',
      label: t('appointments.columns.vehicle'),
      minWidth: 180,
      render: (row) => row.vehicleLabel,
    },
    {
      id: 'service',
      label: t('appointments.columns.service'),
      render: (row) => row.serviceTypeName,
    },
    {
      id: 'technician',
      label: t('appointments.columns.technician'),
      render: (row) => row.technicianName,
    },
    {
      id: 'bay',
      label: t('appointments.columns.bay'),
      render: (row) => row.serviceBayName,
    },
    {
      id: 'start',
      label: t('appointments.columns.start'),
      minWidth: 150,
      render: (row) => formatDateTime(row.startTime),
    },
    {
      id: 'end',
      label: t('appointments.columns.end'),
      minWidth: 150,
      render: (row) => formatDateTime(row.endTime),
    },
    {
      id: 'status',
      label: t('appointments.columns.status'),
      render: (row) => <StatusChip status={row.status} />,
    },
    {
      id: 'action',
      label: t('appointments.columns.action'),
      render: (row) => (
        <Button
          component={RouterLink}
          to={ROUTES.appointmentDetail(row.id)}
          size="small"
        >
          {t('common.view')}
        </Button>
      ),
    },
  ]

  if (isLoading) return <Loading />
  if (isError) return <ErrorState onRetry={() => void refetch()} />

  return (
    <Box>
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
        <Typography variant="h4">{t('appointments.title')}</Typography>
        <Button
          component={RouterLink}
          to={ROUTES.createAppointment}
          variant="contained"
          startIcon={<AddIcon />}
        >
          {t('common.create')}
        </Button>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr 1fr',
            md: '2fr 1fr 1fr',
          },
          gap: 2,
          mb: 2.5,
        }}
      >
        <TextField
          label={t('appointments.searchCustomer')}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          fullWidth
        />
        <FormControl fullWidth>
          <InputLabel id="status-filter-label">
            {t('appointments.statusFilter')}
          </InputLabel>
          <Select
            labelId="status-filter-label"
            label={t('appointments.statusFilter')}
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as AppointmentStatus | 'all')
            }
          >
            <MenuItem value="all">{t('appointments.allStatuses')}</MenuItem>
            {APPOINTMENT_STATUSES.map((item) => (
              <MenuItem key={item} value={item}>
                {en.status[item]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <DatePicker
          label={t('appointments.dateFilter')}
          value={date}
          onChange={(value) => setDate(value)}
          slotProps={{
            textField: { fullWidth: true },
            field: { clearable: true },
          }}
        />
      </Box>

      <AppTable columns={columns} rows={filtered} getRowId={(row) => row.id} />
    </Box>
  )
}
