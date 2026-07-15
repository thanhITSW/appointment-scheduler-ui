export function vehicleLabel(vehicle: {
  year: number
  make: string
  model: string
  licensePlate: string
}): string {
  return `${vehicle.year} ${vehicle.make} ${vehicle.model} (${vehicle.licensePlate})`
}

export function customerLabel(customer: {
  firstName: string
  lastName: string
}): string {
  return `${customer.firstName} ${customer.lastName}`.trim()
}
