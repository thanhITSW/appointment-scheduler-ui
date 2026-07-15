/**
 * English API / system error messages.
 * Keys mirror backend `messageCode` paths (e.g. error.appointment.in_past).
 */
export const errorMessages = {
  error: {
    authentication: {
      unauthorize: 'You are not authorized. Please sign in again.',
    },
    access: {
      forbidden: 'You do not have permission to perform this action.',
    },
    server: {
      internal: 'An internal server error occurred. Please try again later.',
    },
    'not-found': 'The requested resource was not found.',
    conflict: 'This action conflicts with existing data.',
    required: 'This field is required.',
    invalid: 'The request is invalid. Please check your input and try again.',
    length: 'The value length is invalid.',

    user: {
      'bad-credentials': 'Invalid employee ID or password.',
      locked: 'This user account is locked.',
      invalid: 'This user account is invalid.',
      id: {
        required: 'User ID is required.',
      },
      not_found: 'User was not found.',
      'not-found': 'User was not found.',
      password: {
        required: 'Password is required.',
        length: 'Password length is invalid.',
        not: {
          match: 'Passwords do not match.',
        },
        incorrect: 'Password is incorrect.',
        confirm: {
          required: 'Password confirmation is required.',
          incorrect: 'Password confirmation does not match.',
        },
        same: {
          current: {
            password: 'New password must be different from the current password.',
          },
        },
        reused: 'You cannot reuse a recent password.',
        missing: {
          uppercase: 'Password must include at least one uppercase letter.',
          lowercase: 'Password must include at least one lowercase letter.',
          number: 'Password must include at least one number.',
          special: 'Password must include at least one special character.',
        },
        complexity:
          'Password must include uppercase, lowercase, number, and special character.',
      },
      email: {
        invalid: 'Email format is invalid.',
      },
      old: {
        password: {
          incorrect: 'Current password is incorrect.',
        },
      },
    },

    auth: {
      user_blocked: 'This user account has been blocked.',
      account: {
        locked: 'This account is locked. Please contact an administrator.',
      },
      password: {
        expired: 'Your password has expired. Please change it.',
      },
      refresh_token_expired: 'Your session has expired. Please sign in again.',
      refresh_token_invalid: 'Your session is invalid. Please sign in again.',
      invalid_token_type: 'Invalid token type. Please sign in again.',
    },

    account: {
      action: {
        not: {
          allowed: 'This account action is not allowed.',
        },
      },
    },

    username: {
      required: 'Username is required.',
    },

    'full-name': {
      required: 'Full name is required.',
      size: 'Full name length is invalid.',
    },
    'user-name': {
      size: 'Username length is invalid.',
    },
    email: {
      duplicated: 'This email is already in use.',
      existed: 'This email already exists.',
      invalid: 'Email format is invalid.',
    },
    'employee-id': {
      duplicated: 'This employee ID is already in use.',
      required: 'Employee ID is required.',
      existed: 'This employee ID already exists.',
    },
    employeeId: {
      invalid: 'Employee ID format is invalid.',
    },

    admin: {
      password: {
        incorrect: 'Admin password is incorrect.',
      },
    },

    customer: {
      not_found: 'Customer was not found.',
      'not-found': 'Customer was not found.',
    },
    vehicle: {
      not_found: 'Vehicle was not found.',
      'not-found': 'Vehicle was not found.',
      not_owned_by_customer:
        'This vehicle does not belong to the selected customer.',
    },
    service_type: {
      not_found: 'Service type was not found.',
      'not-found': 'Service type was not found.',
    },
    dealership: {
      not_found: 'Dealership was not found.',
      'not-found': 'Dealership was not found.',
    },
    skill: {
      not_found: 'Skill was not found.',
      'not-found': 'Skill was not found.',
      code: {
        duplicated: 'This skill code already exists.',
      },
    },
    technician: {
      not_found: 'Technician was not found.',
      'not-found': 'Technician was not found.',
      employee_code: {
        duplicated: 'This technician employee code already exists.',
      },
    },
    service_bay: {
      not_found: 'Service bay was not found.',
      'not-found': 'Service bay was not found.',
    },
    appointment: {
      not_found: 'Appointment was not found.',
      'not-found': 'Appointment was not found.',
      in_past: 'Cannot schedule an appointment in the past.',
      conflict: 'This appointment conflicts with an existing booking.',
      invalid_status: 'This status change is not allowed for the appointment.',
      no_available_technician:
        'No technician is available for the selected time.',
      no_available_service_bay:
        'No service bay is available for the selected time.',
    },

    phone: {
      existed: 'This phone number already exists.',
      invalid: 'Phone number format is invalid.',
    },
    vin: {
      existed: 'This VIN already exists.',
    },
    licensePlate: {
      existed: 'This license plate already exists.',
    },
    password: {
      invalid: 'Password format is invalid.',
    },
    role: {
      invalid: 'Role value is invalid.',
    },
    status: {
      invalid: 'Status value is invalid.',
    },
    date: {
      invalid: 'Date value is invalid.',
    },
    time: {
      invalid: 'Time value is invalid.',
    },
  },

  validation: {
    unknown_field: 'An unknown field was provided in the request.',
    invalid_json: 'The request body contains invalid JSON.',
    required_field: 'This field is required.',
    name: {
      required_field: 'Name is required.',
    },
    email: {
      required_field: 'Email is required.',
    },
  },

  /** Template fallbacks for MessageFormat codes: error.{0}.not-found / invalid / existed */
  errorTemplates: {
    notFound: '{entity} was not found.',
    invalid: '{entity} is invalid.',
    existed: '{entity} already exists.',
  },

  entities: {
    user: 'User',
    customer: 'Customer',
    vehicle: 'Vehicle',
    appointment: 'Appointment',
    technician: 'Technician',
    service_bay: 'Service bay',
    'service-bay': 'Service bay',
    service_type: 'Service type',
    'service-type': 'Service type',
    dealership: 'Dealership',
    skill: 'Skill',
    email: 'Email',
    phone: 'Phone',
    vin: 'VIN',
    licensePlate: 'License plate',
    'employee-id': 'Employee ID',
    employeeId: 'Employee ID',
    password: 'Password',
    role: 'Role',
    status: 'Status',
    date: 'Date',
    time: 'Time',
  },
} as const
