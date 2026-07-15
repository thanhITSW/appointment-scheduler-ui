export type AppointmentStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCELLED'

export type TechnicianStatus = 'AVAILABLE' | 'OFF' | 'BUSY'
export type ServiceBayStatus = 'AVAILABLE' | 'OFF' | 'BUSY'
export type UserRole = 'ADVISOR' | 'TECHNICIAN' | 'MANAGER' | 'ADMIN'
export type CustomerMode = 'existing' | 'new'

export interface Customer {
  id: number
  firstName: string
  lastName: string
  phone: string
  email?: string | null
}

export interface Vehicle {
  id: number
  customerId: number
  vin: string
  licensePlate: string
  make: string
  model: string
  year: number
}

export interface ServiceType {
  id: number
  name: string
  durationMinutes: number
  requiredSkillIds?: number[]
  requiredSkillCodes?: string[]
}

export interface Dealership {
  id: number
  name: string
  address: string
}

export interface Technician {
  id: number
  name: string
  employeeCode?: string
  status: TechnicianStatus
  skillIds?: number[]
}

export interface ServiceBay {
  id: number
  name: string
  status: ServiceBayStatus
}

export interface Appointment {
  id: number
  customerId: number
  customerName: string
  vehicleId: number
  vehicleLicensePlate: string
  technicianId: number
  technicianName: string
  serviceBayId: number
  serviceBayName: string
  dealershipId: number
  dealershipName: string
  serviceTypeId: number
  serviceTypeName: string
  appointmentDate: string
  startTime: string
  endTime: string
  status: AppointmentStatus
}

export interface AvailabilityRequest {
  dealershipId: number
  serviceTypeId: number
  appointmentDate: string
  startTime: string
}

export interface AvailabilityResponse {
  available: boolean
  technicianName?: string | null
  serviceBayName?: string | null
  duration?: number | null
  endTime?: string | null
  message?: string | null
  suggestedTimes?: string[] | null
}

export interface CreateAppointmentRequest {
  customerId: number
  vehicleId: number
  serviceTypeId: number
  dealershipId: number
  appointmentDate: string
  startTime: string
}

export interface CreateCustomerRequest {
  firstName: string
  lastName: string
  phone: string
  email?: string
}

export interface CreateVehicleRequest {
  vin: string
  licensePlate: string
  make: string
  model: string
  year: number
}

export interface AppointmentListParams {
  date?: string
  customerId?: number
  status?: AppointmentStatus
  page?: number
  size?: number
  sort?: string
}

export interface AuthUser {
  userId: number
  employeeId: string
  username: string
}

export interface LoginRequest {
  employeeId: string
  password: string
}

export interface JwtTokenDto {
  token: string
  refreshToken: string
  expiredTime: string
  username: string
  employeeId: string
  userId: number
  sessionId: string
}

export interface LoginResponse {
  /** Backend Jackson may serialize `isAuthenticated` as `authenticated` */
  authenticated?: boolean
  isAuthenticated?: boolean
  jwtTokenDto: JwtTokenDto
}

export interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
}

export interface ApiErrorBody {
  messageCode?: string
  message?: string
}
