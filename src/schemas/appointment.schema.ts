import dayjs from 'dayjs'
import { z } from 'zod'

import { t } from '../i18n'

const baseFields = {
  serviceTypeId: z.number({ error: t('form.required') }),
  dealershipId: z.number({ error: t('form.required') }),
  preferredDate: z
    .string()
    .min(1, t('form.required'))
    .refine((value) => !dayjs(value).isBefore(dayjs().startOf('day')), {
      message: t('form.pastDate'),
    }),
  preferredTime: z.string().min(1, t('form.required')),
}

const existingCustomerSchema = z.object({
  customerMode: z.literal('existing'),
  customerId: z.number({ error: t('form.required') }),
  vehicleId: z.number({ error: t('form.required') }),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  vehicleMake: z.string().optional(),
  vehicleModel: z.string().optional(),
  vehicleYear: z.string().optional(),
  vehicleLicensePlate: z.string().optional(),
  vehicleVin: z.string().optional(),
  ...baseFields,
})

const newCustomerSchema = z.object({
  customerMode: z.literal('new'),
  customerId: z.number().optional(),
  vehicleId: z.number().optional(),
  firstName: z.string().min(1, t('form.required')),
  lastName: z.string().min(1, t('form.required')),
  phone: z.string().min(1, t('form.required')),
  email: z
    .string()
    .email(t('form.email'))
    .optional()
    .or(z.literal('')),
  vehicleMake: z.string().min(1, t('form.required')),
  vehicleModel: z.string().min(1, t('form.required')),
  vehicleYear: z
    .string()
    .min(1, t('form.required'))
    .refine((value) => {
      const year = Number(value)
      return Number.isInteger(year) && year >= 1980 && year <= dayjs().year() + 1
    }, t('form.year')),
  vehicleLicensePlate: z.string().min(1, t('form.required')),
  vehicleVin: z
    .string()
    .min(1, t('form.required'))
    .min(11, t('form.vin'))
    .max(17, t('form.vin')),
  ...baseFields,
})

export const createAppointmentSchema = z.discriminatedUnion('customerMode', [
  existingCustomerSchema,
  newCustomerSchema,
])

export type CreateAppointmentFormValues = z.infer<typeof createAppointmentSchema>

export const loginSchema = z.object({
  employeeId: z.string().min(1, t('form.required')),
  password: z.string().min(1, t('form.required')),
})

export type LoginFormValues = z.infer<typeof loginSchema>
