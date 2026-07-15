export function isStubMode(): boolean {
  return import.meta.env.VITE_USE_STUBS !== 'false'
}

export function vehicleLabel(vehicle: {
  year: number
  make: string
  model: string
  licensePlate: string
}): string {
  return `${vehicle.year} ${vehicle.make} ${vehicle.model} (${vehicle.licensePlate})`
}
