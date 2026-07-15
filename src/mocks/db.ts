import dayjs from 'dayjs'

import type {
  Appointment,
  AvailabilityRequest,
  AvailabilityResponse,
  CreateAppointmentRequest,
  Customer,
  Dealership,
  ServiceBay,
  ServiceType,
  Technician,
  Vehicle,
} from '../types'

export const delay = (ms = 350) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms)
  })

export let customers: Customer[] = [
  {
    id: 'c1',
    name: 'Nguyen Van A',
    phone: '+84 90 111 2233',
    email: 'nguyenvana@email.com',
  },
  {
    id: 'c2',
    name: 'Tran Thi B',
    phone: '+84 91 222 3344',
    email: 'tranthib@email.com',
  },
  {
    id: 'c3',
    name: 'Le Minh C',
    phone: '+84 92 333 4455',
    email: 'leminhc@email.com',
  },
  {
    id: 'c4',
    name: 'Pham Duc D',
    phone: '+84 93 444 5566',
  },
]

export let vehicles: Vehicle[] = [
  {
    id: 'v1',
    customerId: 'c1',
    make: 'Toyota',
    model: 'Camry',
    year: 2022,
    licensePlate: '51A-12345',
    vin: 'JTDKB20U877123456',
  },
  {
    id: 'v2',
    customerId: 'c1',
    make: 'Honda',
    model: 'CR-V',
    year: 2021,
    licensePlate: '51A-67890',
    vin: '2HKRM4H75MH123456',
  },
  {
    id: 'v3',
    customerId: 'c2',
    make: 'Mazda',
    model: 'CX-5',
    year: 2023,
    licensePlate: '51B-11111',
    vin: 'JM3KFBCM5P0123456',
  },
  {
    id: 'v4',
    customerId: 'c3',
    make: 'Ford',
    model: 'Ranger',
    year: 2020,
    licensePlate: '51C-22222',
    vin: '1FTER4EH5LLA12345',
  },
  {
    id: 'v5',
    customerId: 'c4',
    make: 'Hyundai',
    model: 'Tucson',
    year: 2024,
    licensePlate: '51D-33333',
    vin: 'KM8J3CAL5PU123456',
  },
]

export const serviceTypes: ServiceType[] = [
  { id: 'st1', name: 'Oil Change', durationMinutes: 60 },
  { id: 'st2', name: 'Brake Service', durationMinutes: 90 },
  { id: 'st3', name: 'Full Inspection', durationMinutes: 120 },
  { id: 'st4', name: 'Tire Rotation', durationMinutes: 45 },
]

export const dealerships: Dealership[] = [
  {
    id: 'd1',
    name: 'Downtown Service Center',
    address: '100 Nguyen Hue, District 1',
  },
  {
    id: 'd2',
    name: 'Westside Dealership',
    address: '250 Lac Long Quan, District 11',
  },
]

export const technicians: Technician[] = [
  { id: 't1', name: 'David Nguyen', available: true },
  { id: 't2', name: 'Michael Tran', available: true },
  { id: 't3', name: 'James Le', available: false },
  { id: 't4', name: 'Anna Pham', available: true },
]

export const serviceBays: ServiceBay[] = [
  { id: 'b1', name: 'Bay 1', available: true },
  { id: 'b2', name: 'Bay 2', available: true },
  { id: 'b3', name: 'Bay 3', available: false },
  { id: 'b4', name: 'Bay 4', available: true },
]

const today = dayjs().format('YYYY-MM-DD')
const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD')

let appointments: Appointment[] = [
  {
    id: 'a1',
    customerId: 'c1',
    customerName: 'Nguyen Van A',
    customerPhone: '+84 90 111 2233',
    vehicleId: 'v1',
    vehicleLabel: '2022 Toyota Camry (51A-12345)',
    vin: 'JTDKB20U877123456',
    serviceTypeId: 'st1',
    serviceTypeName: 'Oil Change',
    dealershipId: 'd1',
    dealershipName: 'Downtown Service Center',
    technicianId: 't1',
    technicianName: 'David Nguyen',
    serviceBayId: 'b2',
    serviceBayName: 'Bay 2',
    startTime: `${today}T09:00:00`,
    endTime: `${today}T10:00:00`,
    status: 'scheduled',
  },
  {
    id: 'a2',
    customerId: 'c2',
    customerName: 'Tran Thi B',
    customerPhone: '+84 91 222 3344',
    vehicleId: 'v3',
    vehicleLabel: '2023 Mazda CX-5 (51B-11111)',
    vin: 'JM3KFBCM5P0123456',
    serviceTypeId: 'st2',
    serviceTypeName: 'Brake Service',
    dealershipId: 'd1',
    dealershipName: 'Downtown Service Center',
    technicianId: 't2',
    technicianName: 'Michael Tran',
    serviceBayId: 'b1',
    serviceBayName: 'Bay 1',
    startTime: `${today}T10:30:00`,
    endTime: `${today}T12:00:00`,
    status: 'in_progress',
  },
  {
    id: 'a3',
    customerId: 'c3',
    customerName: 'Le Minh C',
    customerPhone: '+84 92 333 4455',
    vehicleId: 'v4',
    vehicleLabel: '2020 Ford Ranger (51C-22222)',
    vin: '1FTER4EH5LLA12345',
    serviceTypeId: 'st3',
    serviceTypeName: 'Full Inspection',
    dealershipId: 'd2',
    dealershipName: 'Westside Dealership',
    technicianId: 't4',
    technicianName: 'Anna Pham',
    serviceBayId: 'b4',
    serviceBayName: 'Bay 4',
    startTime: `${today}T08:00:00`,
    endTime: `${today}T10:00:00`,
    status: 'completed',
  },
  {
    id: 'a4',
    customerId: 'c4',
    customerName: 'Pham Duc D',
    customerPhone: '+84 93 444 5566',
    vehicleId: 'v5',
    vehicleLabel: '2024 Hyundai Tucson (51D-33333)',
    vin: 'KM8J3CAL5PU123456',
    serviceTypeId: 'st4',
    serviceTypeName: 'Tire Rotation',
    dealershipId: 'd1',
    dealershipName: 'Downtown Service Center',
    technicianId: 't1',
    technicianName: 'David Nguyen',
    serviceBayId: 'b2',
    serviceBayName: 'Bay 2',
    startTime: `${tomorrow}T14:00:00`,
    endTime: `${tomorrow}T14:45:00`,
    status: 'scheduled',
  },
]

export function getAppointments(): Appointment[] {
  return [...appointments]
}

export function getAppointmentById(id: string): Appointment | undefined {
  return appointments.find((item) => item.id === id)
}

export function checkAvailabilityStub(
  request: AvailabilityRequest,
): AvailabilityResponse {
  const serviceType = serviceTypes.find((s) => s.id === request.serviceTypeId)
  const durationMinutes = serviceType?.durationMinutes ?? 60
  const start = dayjs(`${request.preferredDate}T${request.preferredTime}`)
  const end = start.add(durationMinutes, 'minute')

  const conflict = appointments.some((appt) => {
    if (appt.status === 'cancelled') return false
    const apptStart = dayjs(appt.startTime)
    const apptEnd = dayjs(appt.endTime)
    return (
      apptStart.isSame(request.preferredDate, 'day') &&
      start.isBefore(apptEnd) &&
      end.isAfter(apptStart)
    )
  })

  // 10:00 and 11:00 are deliberately contended in stubs when date is today
  const busySlots = ['10:00', '11:00']
  const isBusySlot =
    request.preferredDate === today && busySlots.includes(request.preferredTime)

  if (conflict || isBusySlot) {
    return {
      available: false,
      message: 'No Technician Available',
      suggestedTimes: ['13:00', '14:00', '15:30'],
    }
  }

  const technician = technicians.find((tech) => tech.available) ?? technicians[0]
  const bay = serviceBays.find((item) => item.available) ?? serviceBays[0]

  return {
    available: true,
    technician,
    serviceBay: bay,
    durationMinutes,
    estimatedEndTime: end.format('HH:mm'),
  }
}

export function createAppointmentStub(
  request: CreateAppointmentRequest,
): Appointment {
  let customer: Customer
  let vehicle: Vehicle

  if (request.customerMode === 'new') {
    if (!request.newCustomer || !request.newVehicle) {
      throw new Error('New customer and vehicle details are required')
    }

    customer = {
      id: `c${Date.now()}`,
      name: request.newCustomer.name,
      phone: request.newCustomer.phone,
      email: request.newCustomer.email || undefined,
    }
    customers = [customer, ...customers]

    vehicle = {
      id: `v${Date.now()}`,
      customerId: customer.id,
      make: request.newVehicle.make,
      model: request.newVehicle.model,
      year: request.newVehicle.year,
      licensePlate: request.newVehicle.licensePlate,
      vin: request.newVehicle.vin,
    }
    vehicles = [vehicle, ...vehicles]
  } else {
    const existingCustomer = customers.find((c) => c.id === request.customerId)
    const existingVehicle = vehicles.find((v) => v.id === request.vehicleId)
    if (!existingCustomer || !existingVehicle) {
      throw new Error('Customer or vehicle not found')
    }
    customer = existingCustomer
    vehicle = existingVehicle
  }

  const serviceType = serviceTypes.find((s) => s.id === request.serviceTypeId)
  const dealership = dealerships.find((d) => d.id === request.dealershipId)
  const technician = technicians.find((t) => t.id === request.technicianId)
  const bay = serviceBays.find((b) => b.id === request.serviceBayId)

  if (!serviceType || !dealership || !technician || !bay) {
    throw new Error('Invalid appointment selection')
  }

  const start = dayjs(`${request.preferredDate}T${request.preferredTime}`)
  const end = start.add(serviceType.durationMinutes, 'minute')

  const appointment: Appointment = {
    id: `a${Date.now()}`,
    customerId: customer.id,
    customerName: customer.name,
    customerPhone: customer.phone,
    vehicleId: vehicle.id,
    vehicleLabel: `${vehicle.year} ${vehicle.make} ${vehicle.model} (${vehicle.licensePlate})`,
    vin: vehicle.vin,
    serviceTypeId: serviceType.id,
    serviceTypeName: serviceType.name,
    dealershipId: dealership.id,
    dealershipName: dealership.name,
    technicianId: technician.id,
    technicianName: technician.name,
    serviceBayId: bay.id,
    serviceBayName: bay.name,
    startTime: start.toISOString(),
    endTime: end.toISOString(),
    status: 'scheduled',
  }

  appointments = [appointment, ...appointments]
  return appointment
}

