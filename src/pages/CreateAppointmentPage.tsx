import { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
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
import { createCustomer } from '../services/customer.service'
import { createVehicle } from '../services/vehicle.service'
import type { AvailabilityResponse, Customer, CustomerMode } from '../types'
import {
  toAvailabilityRequest,
  toCreateAppointmentRequest,
  toCreateCustomerRequest,
  toCreateVehicleRequest,
} from '../utils/appointment'
import { getApiErrorMessage } from '../utils/apiError'
import { customerLabel, vehicleLabel } from '../utils'

export function CreateAppointmentPage() {
  const navigate = useNavigate()
  const { showSnackbar } = useSnackbar()
  const [customerKeyword, setCustomerKeyword] = useState('')
  const customersQuery = useCustomers(customerKeyword)
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
      customerId: undefined,
      vehicleId: undefined,
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      vehicleMake: '',
      vehicleModel: '',
      vehicleYear: String(dayjs().year()),
      vehicleLicensePlate: '',
      vehicleVin: '',
      serviceTypeId: undefined as unknown as number,
      dealershipId: undefined as unknown as number,
      preferredDate: dayjs().format('YYYY-MM-DD'),
      preferredTime: '09:00',
    },
  })

  const customerMode = watch('customerMode')
  const customerId = watch('customerId')
  const vehiclesQuery = useVehicles(
    customerMode === 'existing' && typeof customerId === 'number'
      ? customerId
      : undefined,
  )

  useEffect(() => {
    if (customerMode === 'existing') {
      setValue('vehicleId', undefined as unknown as number)
    }
    setAvailability(null)
  }, [customerId, customerMode, setValue])

  const masterLoading =
    serviceTypesQuery.isLoading || dealershipsQuery.isLoading
  const masterError = serviceTypesQuery.isError || dealershipsQuery.isError

  const customers = useMemo(
    () => customersQuery.data ?? [],
    [customersQuery.data],
  )
  const serviceTypes = serviceTypesQuery.data ?? []
  const dealerships = dealershipsQuery.data ?? []
  const vehicles = vehiclesQuery.data ?? []

  if (masterLoading) return <Loading />
  if (masterError) {
    return (
      <ErrorState
        onRetry={() => {
          void serviceTypesQuery.refetch()
          void dealershipsQuery.refetch()
        }}
      />
    )
  }

  const onModeChange = (_: unknown, value: CustomerMode | null) => {
    if (!value) return
    const shared = {
      serviceTypeId: getValues('serviceTypeId'),
      dealershipId: getValues('dealershipId'),
      preferredDate: getValues('preferredDate'),
      preferredTime: getValues('preferredTime'),
    }

    if (value === 'existing') {
      reset({
        customerMode: 'existing',
        customerId: undefined as unknown as number,
        vehicleId: undefined as unknown as number,
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        vehicleMake: '',
        vehicleModel: '',
        vehicleYear: String(dayjs().year()),
        vehicleLicensePlate: '',
        vehicleVin: '',
        ...shared,
      })
    } else {
      reset({
        customerMode: 'new',
        customerId: undefined,
        vehicleId: undefined,
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        vehicleMake: '',
        vehicleModel: '',
        vehicleYear: String(dayjs().year()),
        vehicleLicensePlate: '',
        vehicleVin: '',
        ...shared,
      })
    }
    setAvailability(null)
  }

  const onCheckAvailability = handleSubmit(async (values) => {
    try {
      const result = await checkAvailability.mutateAsync(
        toAvailabilityRequest(values),
      )
      setAvailability(result)
    } catch (error) {
      showSnackbar(getApiErrorMessage(error), 'error')
    }
  })

  const onConfirm = async () => {
    if (!availability?.available) return
    const values = getValues()
    try {
      let customerIdValue: number
      let vehicleIdValue: number

      if (values.customerMode === 'new') {
        const customer = await createCustomer(toCreateCustomerRequest(values))
        const vehicle = await createVehicle(
          customer.id,
          toCreateVehicleRequest(values),
        )
        customerIdValue = customer.id
        vehicleIdValue = vehicle.id
      } else {
        customerIdValue = values.customerId
        vehicleIdValue = values.vehicleId
      }

      const appointment = await createAppointment.mutateAsync(
        toCreateAppointmentRequest(customerIdValue, vehicleIdValue, values),
      )
      showSnackbar(t('common.saveSuccess'), 'success')
      setConfirmOpen(false)
      void navigate(ROUTES.appointmentDetail(appointment.id))
    } catch (error) {
      showSnackbar(getApiErrorMessage(error, t('common.saveError')), 'error')
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
                      loading={customersQuery.isFetching}
                      getOptionLabel={(option: Customer) =>
                        `${customerLabel(option)} (${option.phone})`
                      }
                      onInputChange={(_, value, reason) => {
                        if (reason === 'input') setCustomerKeyword(value)
                      }}
                      onChange={(_, value) => field.onChange(value?.id)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t('create.customer')}
                          placeholder={t('create.searchCustomer')}
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
                      value={field.value ?? ''}
                      labelId="vehicle-label"
                      label={t('create.vehicle')}
                      disabled={typeof customerId !== 'number'}
                      onChange={(event) =>
                        field.onChange(Number(event.target.value))
                      }
                    >
                      {vehicles.map((vehicle) => (
                        <MenuItem key={vehicle.id} value={vehicle.id}>
                          {vehicleLabel(vehicle)}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {('vehicleId' in errors && errors.vehicleId?.message) ||
                        (typeof customerId !== 'number'
                          ? t('create.selectCustomerFirst')
                          : ' ')}
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
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('create.firstName')}
                      error={Boolean(
                        'firstName' in errors ? errors.firstName : false,
                      )}
                      helperText={
                        'firstName' in errors
                          ? errors.firstName?.message
                          : undefined
                      }
                      fullWidth
                    />
                  )}
                />
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('create.lastName')}
                      error={Boolean(
                        'lastName' in errors ? errors.lastName : false,
                      )}
                      helperText={
                        'lastName' in errors
                          ? errors.lastName?.message
                          : undefined
                      }
                      fullWidth
                    />
                  )}
                />
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('create.customerPhone')}
                      error={Boolean('phone' in errors ? errors.phone : false)}
                      helperText={
                        'phone' in errors ? errors.phone?.message : undefined
                      }
                      fullWidth
                    />
                  )}
                />
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('create.customerEmail')}
                      error={Boolean('email' in errors ? errors.email : false)}
                      helperText={
                        'email' in errors ? errors.email?.message : undefined
                      }
                      fullWidth
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
                {(
                  [
                    ['vehicleMake', t('create.vehicleMake')],
                    ['vehicleModel', t('create.vehicleModel')],
                    ['vehicleYear', t('create.vehicleYear')],
                    ['vehicleLicensePlate', t('create.vehicleLicensePlate')],
                    ['vehicleVin', t('create.vehicleVin')],
                  ] as const
                ).map(([name, label]) => (
                  <Controller
                    key={name}
                    name={name}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={label}
                        error={Boolean(name in errors)}
                        helperText={
                          name in errors
                            ? (errors as Record<string, { message?: string }>)[
                                name
                              ]?.message
                            : undefined
                        }
                        fullWidth
                        sx={
                          name === 'vehicleVin'
                            ? { gridColumn: { sm: '1 / -1' } }
                            : undefined
                        }
                      />
                    )}
                  />
                ))}
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
                  value={field.value ?? ''}
                  labelId="service-type-label"
                  label={t('create.serviceType')}
                  onChange={(event) => field.onChange(Number(event.target.value))}
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
                  value={field.value ?? ''}
                  labelId="dealership-label"
                  label={t('create.dealership')}
                  onChange={(event) => field.onChange(Number(event.target.value))}
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
                  onChange={(value: Dayjs | null) => {
                    field.onChange(value ? value.format('YYYY-MM-DD') : '')
                    setAvailability(null)
                  }}
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
                ✓ {t('create.technician')}: {availability.technicianName}
              </Typography>
              <Typography>
                ✓ {t('create.serviceBay')}: {availability.serviceBayName}
              </Typography>
              <Typography>
                {t('create.duration')}: {availability.duration}{' '}
                {t('create.minutes')}
              </Typography>
              <Typography>
                {t('create.estimatedEnd')}: {availability.endTime}
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
                {availability.message || t('create.unavailable')}
              </Typography>
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
