export type AppointmentStatus =
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show'

export type CustomerMode = 'existing' | 'new'

export interface Customer {
  id: string
  name: string
  phone: string
  email?: string
}

export interface Vehicle {
  id: string
  customerId: string
  make: string
  model: string
  year: number
  licensePlate: string
  vin: string
}

export interface NewCustomerInput {
  name: string
  phone: string
  email?: string
}

export interface NewVehicleInput {
  make: string
  model: string
  year: number
  licensePlate: string
  vin: string
}

export interface ServiceType {
  id: string
  name: string
  durationMinutes: number
}

export interface Dealership {
  id: string
  name: string
  address: string
}

export interface Technician {
  id: string
  name: string
  available: boolean
}

export interface ServiceBay {
  id: string
  name: string
  available: boolean
}

export interface Appointment {
  id: string
  customerId: string
  customerName: string
  customerPhone: string
  vehicleId: string
  vehicleLabel: string
  vin: string
  serviceTypeId: string
  serviceTypeName: string
  dealershipId: string
  dealershipName: string
  technicianId: string
  technicianName: string
  serviceBayId: string
  serviceBayName: string
  startTime: string
  endTime: string
  status: AppointmentStatus
}

export interface AvailabilityRequest {
  customerMode: CustomerMode
  customerId?: string
  vehicleId?: string
  newCustomer?: NewCustomerInput
  newVehicle?: NewVehicleInput
  serviceTypeId: string
  dealershipId: string
  preferredDate: string
  preferredTime: string
}

export interface AvailabilitySuccess {
  available: true
  technician: Technician
  serviceBay: ServiceBay
  durationMinutes: number
  estimatedEndTime: string
}

export interface AvailabilityFailure {
  available: false
  message: string
  suggestedTimes: string[]
}

export type AvailabilityResponse = AvailabilitySuccess | AvailabilityFailure

export interface CreateAppointmentRequest extends AvailabilityRequest {
  technicianId: string
  serviceBayId: string
}

export interface AuthUser {
  id: string
  name: string
  email: string
  role: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: AuthUser
}
