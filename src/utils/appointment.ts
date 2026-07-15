import type { CreateAppointmentFormValues } from '../schemas/appointment.schema'
import type { AvailabilityRequest, CreateAppointmentRequest } from '../types'

export function toAvailabilityRequest(
  values: CreateAppointmentFormValues,
): AvailabilityRequest {
  const shared = {
    serviceTypeId: values.serviceTypeId,
    dealershipId: values.dealershipId,
    preferredDate: values.preferredDate,
    preferredTime: values.preferredTime,
  }

  if (values.customerMode === 'existing') {
    return {
      customerMode: 'existing',
      customerId: values.customerId,
      vehicleId: values.vehicleId,
      ...shared,
    }
  }

  return {
    customerMode: 'new',
    newCustomer: {
      name: values.newCustomerName,
      phone: values.newCustomerPhone,
      email: values.newCustomerEmail || undefined,
    },
    newVehicle: {
      make: values.vehicleMake,
      model: values.vehicleModel,
      year: Number(values.vehicleYear),
      licensePlate: values.vehicleLicensePlate,
      vin: values.vehicleVin,
    },
    ...shared,
  }
}

export function toCreateAppointmentRequest(
  values: CreateAppointmentFormValues,
  technicianId: string,
  serviceBayId: string,
): CreateAppointmentRequest {
  return {
    ...toAvailabilityRequest(values),
    technicianId,
    serviceBayId,
  }
}
