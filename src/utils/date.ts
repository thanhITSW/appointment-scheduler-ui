import dayjs from 'dayjs'

export function appointmentStartIso(appointment: {
  appointmentDate: string
  startTime: string
}): string {
  const time =
    appointment.startTime.length === 5
      ? `${appointment.startTime}:00`
      : appointment.startTime
  return `${appointment.appointmentDate}T${time}`
}

export function appointmentEndIso(appointment: {
  appointmentDate: string
  endTime: string
}): string {
  const time =
    appointment.endTime.length === 5
      ? `${appointment.endTime}:00`
      : appointment.endTime
  return `${appointment.appointmentDate}T${time}`
}

export function formatDateTime(value: string): string {
  return dayjs(value).format('MMM D, YYYY h:mm A')
}

export function formatTime(value: string): string {
  if (/^\d{2}:\d{2}/.test(value) && !value.includes('T')) {
    return dayjs(`2000-01-01T${value}`).format('h:mm A')
  }
  return dayjs(value).format('h:mm A')
}

export function formatDate(value: string): string {
  return dayjs(value).format('MMM D, YYYY')
}

export function isSameDay(value: string, compare: dayjs.Dayjs = dayjs()): boolean {
  return dayjs(value).isSame(compare, 'day')
}

export function formatAppointmentStart(appointment: {
  appointmentDate: string
  startTime: string
}): string {
  return formatDateTime(appointmentStartIso(appointment))
}

export function formatAppointmentEnd(appointment: {
  appointmentDate: string
  endTime: string
}): string {
  return formatDateTime(appointmentEndIso(appointment))
}
