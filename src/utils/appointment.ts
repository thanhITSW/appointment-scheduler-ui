import type { CreateAppointmentFormValues } from '../schemas/appointment.schema'
import type {
  AvailabilityRequest,
  CreateAppointmentRequest,
  CreateCustomerRequest,
  CreateVehicleRequest,
} from '../types'

export function toAvailabilityRequest(
  values: CreateAppointmentFormValues,
): AvailabilityRequest {
  return {
    dealershipId: values.dealershipId,
    serviceTypeId: values.serviceTypeId,
    appointmentDate: values.preferredDate,
    startTime: values.preferredTime,
  }
}

export function toCreateAppointmentRequest(
  customerId: number,
  vehicleId: number,
  values: CreateAppointmentFormValues,
): CreateAppointmentRequest {
  return {
    customerId,
    vehicleId,
    serviceTypeId: values.serviceTypeId,
    dealershipId: values.dealershipId,
    appointmentDate: values.preferredDate,
    startTime: values.preferredTime,
  }
}

export function toCreateCustomerRequest(
  values: Extract<CreateAppointmentFormValues, { customerMode: 'new' }>,
): CreateCustomerRequest {
  return {
    firstName: values.firstName,
    lastName: values.lastName,
    phone: values.phone,
    email: values.email || undefined,
  }
}

export function toCreateVehicleRequest(
  values: Extract<CreateAppointmentFormValues, { customerMode: 'new' }>,
): CreateVehicleRequest {
  return {
    make: values.vehicleMake,
    model: values.vehicleModel,
    year: Number(values.vehicleYear),
    licensePlate: values.vehicleLicensePlate,
    vin: values.vehicleVin,
  }
}
