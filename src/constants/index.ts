export const ROUTES = {
  login: '/login',
  dashboard: '/',
  appointments: '/appointments',
  createAppointment: '/appointments/new',
  appointmentDetail: (id: number | string) => `/appointments/${id}`,
} as const

export const AUTH_STORAGE_KEY = 'uss.auth'

export const MASTER_STALE_TIME = 10 * 60 * 1000
export const TRANSACTION_STALE_TIME = 0

export const APPOINTMENT_STATUSES = [
  'PENDING',
  'CONFIRMED',
  'COMPLETED',
  'CANCELLED',
] as const

export const DRAWER_WIDTH = 260

export const DEMO_CREDENTIALS = {
  employeeId: 'adv01',
  password: 'Admin@123',
} as const
