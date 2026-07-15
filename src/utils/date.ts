import dayjs from 'dayjs'

export function formatDateTime(value: string): string {
  return dayjs(value).format('MMM D, YYYY h:mm A')
}

export function formatTime(value: string): string {
  return dayjs(value).format('h:mm A')
}

export function formatDate(value: string): string {
  return dayjs(value).format('MMM D, YYYY')
}

export function isSameDay(value: string, compare: dayjs.Dayjs = dayjs()): boolean {
  return dayjs(value).isSame(compare, 'day')
}
