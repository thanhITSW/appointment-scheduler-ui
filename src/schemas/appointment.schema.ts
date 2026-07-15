import dayjs from 'dayjs'
import { z } from 'zod'

import { t } from '../i18n'

const baseFields = {
  serviceTypeId: z.string().min(1, t('validation.required')),
  dealershipId: z.string().min(1, t('validation.required')),
  preferredDate: z
    .string()
    .min(1, t('validation.required'))
    .refine((value) => !dayjs(value).isBefore(dayjs().startOf('day')), {
      message: t('validation.pastDate'),
    }),
  preferredTime: z.string().min(1, t('validation.required')),
}

const existingCustomerSchema = z.object({
  customerMode: z.literal('existing'),
  customerId: z.string().min(1, t('validation.required')),
  vehicleId: z.string().min(1, t('validation.required')),
  newCustomerName: z.string().optional(),
  newCustomerPhone: z.string().optional(),
  newCustomerEmail: z.string().optional(),
  vehicleMake: z.string().optional(),
  vehicleModel: z.string().optional(),
  vehicleYear: z.string().optional(),
  vehicleLicensePlate: z.string().optional(),
  vehicleVin: z.string().optional(),
  ...baseFields,
})

const newCustomerSchema = z.object({
  customerMode: z.literal('new'),
  customerId: z.string().optional(),
  vehicleId: z.string().optional(),
  newCustomerName: z.string().min(1, t('validation.required')),
  newCustomerPhone: z.string().min(1, t('validation.required')),
  newCustomerEmail: z
    .string()
    .email(t('validation.email'))
    .optional()
    .or(z.literal('')),
  vehicleMake: z.string().min(1, t('validation.required')),
  vehicleModel: z.string().min(1, t('validation.required')),
  vehicleYear: z
    .string()
    .min(1, t('validation.required'))
    .refine((value) => {
      const year = Number(value)
      return Number.isInteger(year) && year >= 1980 && year <= dayjs().year() + 1
    }, t('validation.year')),
  vehicleLicensePlate: z.string().min(1, t('validation.required')),
  vehicleVin: z
    .string()
    .min(1, t('validation.required'))
    .min(11, t('validation.vin'))
    .max(17, t('validation.vin')),
  ...baseFields,
})

export const createAppointmentSchema = z.discriminatedUnion('customerMode', [
  existingCustomerSchema,
  newCustomerSchema,
])

export type CreateAppointmentFormValues = z.infer<typeof createAppointmentSchema>

export const loginSchema = z.object({
  email: z.string().min(1, t('validation.required')).email(t('validation.email')),
  password: z.string().min(1, t('validation.required')),
})

export type LoginFormValues = z.infer<typeof loginSchema>
