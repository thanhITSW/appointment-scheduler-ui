import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Typography from '@mui/material/Typography'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import dayjs, { type Dayjs } from 'dayjs'

import { ConfirmDialog } from '../components/common/ConfirmDialog'
import { ErrorState } from '../components/common/ErrorState'
import { Loading } from '../components/common/Loading'
import { useSnackbar } from '../components/common/snackbarContext'
import { ROUTES } from '../constants'
import { useCreateAppointment } from '../hooks/mutations/useCreateAppointment'
import { useCustomers } from '../hooks/queries/useCustomers'
import { useDealerships } from '../hooks/queries/useDealerships'
import { useServiceTypes } from '../hooks/queries/useServiceTypes'
import { useVehicles } from '../hooks/queries/useVehicles'
import { useCheckAvailability } from '../hooks/useCheckAvailability'
import { t } from '../i18n'
import {
  createAppointmentSchema,
  type CreateAppointmentFormValues,
} from '../schemas/appointment.schema'
import type { AvailabilityResponse, Customer, CustomerMode } from '../types'
import {
  toAvailabilityRequest,
  toCreateAppointmentRequest,
} from '../utils/appointment'
import { vehicleLabel } from '../utils'

export function CreateAppointmentPage() {
  const navigate = useNavigate()
  const { showSnackbar } = useSnackbar()
  const customersQuery = useCustomers()
  const serviceTypesQuery = useServiceTypes()
  const dealershipsQuery = useDealerships()
  const checkAvailability = useCheckAvailability()
  const createAppointment = useCreateAppointment()

  const [availability, setAvailability] = useState<AvailabilityResponse | null>(
    null,
  )
  const [confirmOpen, setConfirmOpen] = useState(false)

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm<CreateAppointmentFormValues>({
    resolver: zodResolver(createAppointmentSchema),
    defaultValues: {
      customerMode: 'existing',
      customerId: '',
      vehicleId: '',
      newCustomerName: '',
      newCustomerPhone: '',
      newCustomerEmail: '',
      vehicleMake: '',
      vehicleModel: '',
      vehicleYear: String(dayjs().year()),
      vehicleLicensePlate: '',
      vehicleVin: '',
      serviceTypeId: '',
      dealershipId: '',
      preferredDate: dayjs().format('YYYY-MM-DD'),
      preferredTime: '09:00',
    },
  })

  const customerMode = watch('customerMode')
  const customerId = watch('customerId')
  const vehiclesQuery = useVehicles(
    customerMode === 'existing' && customerId ? customerId : undefined,
  )

  useEffect(() => {
    if (customerMode === 'existing') {
      setValue('vehicleId', '')
    }
    setAvailability(null)
  }, [customerId, customerMode, setValue])

  const masterLoading =
    customersQuery.isLoading ||
    serviceTypesQuery.isLoading ||
    dealershipsQuery.isLoading
  const masterError =
    customersQuery.isError ||
    serviceTypesQuery.isError ||
    dealershipsQuery.isError

  if (masterLoading) return <Loading />
  if (masterError) {
    return (
      <ErrorState
        onRetry={() => {
          void customersQuery.refetch()
          void serviceTypesQuery.refetch()
          void dealershipsQuery.refetch()
        }}
      />
    )
  }

  const customers = customersQuery.data ?? []
  const serviceTypes = serviceTypesQuery.data ?? []
  const dealerships = dealershipsQuery.data ?? []
  const vehicles = vehiclesQuery.data ?? []

  const onModeChange = (_: unknown, value: CustomerMode | null) => {
    if (!value) return
    reset({
      ...getValues(),
      customerMode: value,
      customerId: '',
      vehicleId: '',
      newCustomerName: '',
      newCustomerPhone: '',
      newCustomerEmail: '',
      vehicleMake: '',
      vehicleModel: '',
      vehicleYear: String(dayjs().year()),
      vehicleLicensePlate: '',
      vehicleVin: '',
    })
    setAvailability(null)
  }

  const onCheckAvailability = handleSubmit(async (values) => {
    try {
      const result = await checkAvailability.mutateAsync(
        toAvailabilityRequest(values),
      )
      setAvailability(result)
    } catch (error) {
      showSnackbar(
        error instanceof Error ? error.message : t('common.error'),
        'error',
      )
    }
  })

  const onConfirm = async () => {
    if (!availability || !availability.available) return
    const values = getValues()
    try {
      const appointment = await createAppointment.mutateAsync(
        toCreateAppointmentRequest(
          values,
          availability.technician.id,
          availability.serviceBay.id,
        ),
      )
      showSnackbar(t('common.saveSuccess'), 'success')
      setConfirmOpen(false)
      void navigate(ROUTES.appointmentDetail(appointment.id))
    } catch (error) {
      showSnackbar(
        error instanceof Error ? error.message : t('common.saveError'),
        'error',
      )
    }
  }

  return (
    <Box sx={{ maxWidth: 840 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        {t('create.title')}
      </Typography>

      <Paper
        elevation={0}
        sx={{ p: { xs: 2, sm: 3 }, border: '1px solid', borderColor: 'divider' }}
      >
        <Stack spacing={2.5}>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {t('create.customerMode')}
            </Typography>
            <ToggleButtonGroup
              exclusive
              value={customerMode}
              onChange={onModeChange}
              color="primary"
              fullWidth
              sx={{
                '& .MuiToggleButton-root': { textTransform: 'none', py: 1 },
              }}
            >
              <ToggleButton value="existing">
                {t('create.existingCustomer')}
              </ToggleButton>
              <ToggleButton value="new">{t('create.newCustomer')}</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {customerMode === 'existing' ? (
            <>
              <Controller
                name="customerId"
                control={control}
                render={({ field }) => {
                  const selected =
                    customers.find((item) => item.id === field.value) ?? null
                  return (
                    <Autocomplete
                      options={customers}
                      value={selected}
                      getOptionLabel={(option: Customer) => option.name}
                      onChange={(_, value) => field.onChange(value?.id ?? '')}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t('create.customer')}
                          error={Boolean(
                            'customerId' in errors ? errors.customerId : false,
                          )}
                          helperText={
                            'customerId' in errors
                              ? errors.customerId?.message
                              : undefined
                          }
                        />
                      )}
                    />
                  )
                }}
              />

              <Controller
                name="vehicleId"
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    error={Boolean(
                      'vehicleId' in errors ? errors.vehicleId : false,
                    )}
                  >
                    <InputLabel id="vehicle-label">{t('create.vehicle')}</InputLabel>
                    <Select
                      {...field}
                      value={field.value ?? ''}
                      labelId="vehicle-label"
                      label={t('create.vehicle')}
                      disabled={!customerId}
                    >
                      {vehicles.map((vehicle) => (
                        <MenuItem key={vehicle.id} value={vehicle.id}>
                          {vehicleLabel(vehicle)}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {('vehicleId' in errors && errors.vehicleId?.message) ||
                        (!customerId ? t('create.selectCustomerFirst') : ' ')}
                    </FormHelperText>
                  </FormControl>
                )}
              />
            </>
          ) : (
            <>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {t('create.newCustomerSection')}
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: 2,
                }}
              >
                <Controller
                  name="newCustomerName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('create.customerName')}
                      error={Boolean(
                        'newCustomerName' in errors
                          ? errors.newCustomerName
                          : false,
                      )}
                      helperText={
                        'newCustomerName' in errors
                          ? errors.newCustomerName?.message
                          : undefined
                      }
                      fullWidth
                    />
                  )}
                />
                <Controller
                  name="newCustomerPhone"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('create.customerPhone')}
                      error={Boolean(
                        'newCustomerPhone' in errors
                          ? errors.newCustomerPhone
                          : false,
                      )}
                      helperText={
                        'newCustomerPhone' in errors
                          ? errors.newCustomerPhone?.message
                          : undefined
                      }
                      fullWidth
                    />
                  )}
                />
                <Controller
                  name="newCustomerEmail"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('create.customerEmail')}
                      error={Boolean(
                        'newCustomerEmail' in errors
                          ? errors.newCustomerEmail
                          : false,
                      )}
                      helperText={
                        'newCustomerEmail' in errors
                          ? errors.newCustomerEmail?.message
                          : undefined
                      }
                      fullWidth
                      sx={{ gridColumn: { sm: '1 / -1' } }}
                    />
                  )}
                />
              </Box>

              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {t('create.newVehicleSection')}
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: 2,
                }}
              >
                <Controller
                  name="vehicleMake"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('create.vehicleMake')}
                      error={Boolean(
                        'vehicleMake' in errors ? errors.vehicleMake : false,
                      )}
                      helperText={
                        'vehicleMake' in errors
                          ? errors.vehicleMake?.message
                          : undefined
                      }
                      fullWidth
                    />
                  )}
                />
                <Controller
                  name="vehicleModel"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('create.vehicleModel')}
                      error={Boolean(
                        'vehicleModel' in errors ? errors.vehicleModel : false,
                      )}
                      helperText={
                        'vehicleModel' in errors
                          ? errors.vehicleModel?.message
                          : undefined
                      }
                      fullWidth
                    />
                  )}
                />
                <Controller
                  name="vehicleYear"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('create.vehicleYear')}
                      error={Boolean(
                        'vehicleYear' in errors ? errors.vehicleYear : false,
                      )}
                      helperText={
                        'vehicleYear' in errors
                          ? errors.vehicleYear?.message
                          : undefined
                      }
                      fullWidth
                    />
                  )}
                />
                <Controller
                  name="vehicleLicensePlate"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('create.vehicleLicensePlate')}
                      error={Boolean(
                        'vehicleLicensePlate' in errors
                          ? errors.vehicleLicensePlate
                          : false,
                      )}
                      helperText={
                        'vehicleLicensePlate' in errors
                          ? errors.vehicleLicensePlate?.message
                          : undefined
                      }
                      fullWidth
                    />
                  )}
                />
                <Controller
                  name="vehicleVin"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('create.vehicleVin')}
                      error={Boolean(
                        'vehicleVin' in errors ? errors.vehicleVin : false,
                      )}
                      helperText={
                        'vehicleVin' in errors
                          ? errors.vehicleVin?.message
                          : undefined
                      }
                      fullWidth
                      sx={{ gridColumn: { sm: '1 / -1' } }}
                    />
                  )}
                />
              </Box>
            </>
          )}

          <Controller
            name="serviceTypeId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={Boolean(errors.serviceTypeId)}>
                <InputLabel id="service-type-label">
                  {t('create.serviceType')}
                </InputLabel>
                <Select
                  {...field}
                  labelId="service-type-label"
                  label={t('create.serviceType')}
                >
                  {serviceTypes.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name} ({item.durationMinutes} {t('create.minutes')})
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.serviceTypeId?.message}</FormHelperText>
              </FormControl>
            )}
          />

          <Controller
            name="dealershipId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={Boolean(errors.dealershipId)}>
                <InputLabel id="dealership-label">
                  {t('create.dealership')}
                </InputLabel>
                <Select
                  {...field}
                  labelId="dealership-label"
                  label={t('create.dealership')}
                >
                  {dealerships.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.dealershipId?.message}</FormHelperText>
              </FormControl>
            )}
          />

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 2,
            }}
          >
            <Controller
              name="preferredDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label={t('create.preferredDate')}
                  value={field.value ? dayjs(field.value) : null}
                  minDate={dayjs().startOf('day')}
                  onChange={(value: Dayjs | null) =>
                    field.onChange(value ? value.format('YYYY-MM-DD') : '')
                  }
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: Boolean(errors.preferredDate),
                      helperText: errors.preferredDate?.message,
                    },
                  }}
                />
              )}
            />
            <Controller
              name="preferredTime"
              control={control}
              render={({ field }) => (
                <TimePicker
                  label={t('create.preferredTime')}
                  value={
                    field.value ? dayjs(`2000-01-01T${field.value}`) : null
                  }
                  onChange={(value: Dayjs | null) => {
                    field.onChange(value ? value.format('HH:mm') : '')
                    setAvailability(null)
                  }}
                  ampm={false}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: Boolean(errors.preferredTime),
                      helperText: errors.preferredTime?.message,
                    },
                  }}
                />
              )}
            />
          </Box>

          <Box>
            <Button
              variant="contained"
              onClick={() => void onCheckAvailability()}
              disabled={checkAvailability.isPending}
            >
              {t('create.checkAvailability')}
            </Button>
          </Box>
        </Stack>
      </Paper>

      {availability ? (
        <Paper
          elevation={0}
          sx={{
            mt: 3,
            p: { xs: 2, sm: 3 },
            border: '1px solid',
            borderColor: availability.available
              ? 'success.light'
              : 'warning.light',
            bgcolor: availability.available ? '#F0FDF4' : '#FFFBEB',
          }}
        >
          {availability.available ? (
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <CheckCircleOutlinedIcon color="success" />
                <Typography variant="h6">{t('create.available')}</Typography>
              </Stack>
              <Typography>
                ✓ {t('create.technician')}: {availability.technician.name}
              </Typography>
              <Typography>
                ✓ {t('create.serviceBay')}: {availability.serviceBay.name}
              </Typography>
              <Typography>
                {t('create.duration')}: {availability.durationMinutes}{' '}
                {t('create.minutes')}
              </Typography>
              <Typography>
                {t('create.estimatedEnd')}: {availability.estimatedEndTime}
              </Typography>
              <Box>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => setConfirmOpen(true)}
                >
                  {t('create.confirmAppointment')}
                </Button>
              </Box>
            </Stack>
          ) : (
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <HighlightOffOutlinedIcon color="warning" />
                <Typography variant="h6">{t('create.unavailable')}</Typography>
              </Stack>
              <Typography color="text.secondary">
                {availability.message}
              </Typography>
              <Typography sx={{ fontWeight: 600 }}>
                {t('create.suggestedTimes')}
              </Typography>
              <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
                {availability.suggestedTimes.map((time) => (
                  <Chip
                    key={time}
                    label={time}
                    clickable
                    color="primary"
                    variant="outlined"
                    onClick={() => {
                      setValue('preferredTime', time, { shouldValidate: true })
                      setAvailability(null)
                    }}
                  />
                ))}
              </Stack>
            </Stack>
          )}
        </Paper>
      ) : null}

      <ConfirmDialog
        open={confirmOpen}
        title={t('create.confirmTitle')}
        message={t('create.confirmMessage')}
        loading={createAppointment.isPending}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => void onConfirm()}
      />
    </Box>
  )
}
