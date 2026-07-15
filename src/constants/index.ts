export const ROUTES = {
  login: '/login',
  dashboard: '/',
  appointments: '/appointments',
  createAppointment: '/appointments/new',
  appointmentDetail: (id: string) => `/appointments/${id}`,
} as const

export const AUTH_STORAGE_KEY = 'dss.auth'

export const MASTER_STALE_TIME = 10 * 60 * 1000
export const TRANSACTION_STALE_TIME = 0

export const APPOINTMENT_STATUSES = [
  'scheduled',
  'in_progress',
  'completed',
  'cancelled',
  'no_show',
] as const

export const DRAWER_WIDTH = 260

export const DEMO_CREDENTIALS = {
  email: 'advisor@dealership.com',
  password: 'password',
} as const
