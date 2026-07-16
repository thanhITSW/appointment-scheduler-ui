export const queryKeys = {
  appointments: {
    all: ['appointments'] as const,
    detail: (id: string) => ['appointments', id] as const,
  },
  customers: {
    all: ['customers'] as const,
  },
  vehicles: {
    byCustomer: (customerId: string) => ['vehicles', customerId] as const,
  },
  technicians: {
    all: ['technicians'] as const,
  },
  serviceBays: {
    all: ['serviceBays'] as const,
  },
  serviceTypes: {
    all: ['serviceTypes'] as const,
  },
  dealerships: {
    all: ['dealerships'] as const,
  },
  availability: ['availability'] as const,
} as const
