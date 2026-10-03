const pad = (n: number) => String(n).padStart(2, '0')

/** YYYY-MM-DD in local time. */
export const toIsoDate = (date: Date): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

export const todayIso = (): string => toIsoDate(new Date())

export const addDays = (iso: string, days: number): string => {
  const [y, m, d] = iso.split('-').map(Number)
  return toIsoDate(new Date(y, m - 1, d + days))
}

const dayFormatter = new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short' })
const longFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'long', day: 'numeric', month: 'long' })

export const formatDay = (iso: string): string => {
  const [y, m, d] = iso.split('-').map(Number)
  return dayFormatter.format(new Date(y, m - 1, d))
}

export const formatLongDay = (iso: string): string => {
  const [y, m, d] = iso.split('-').map(Number)
  return longFormatter.format(new Date(y, m - 1, d))
}

export const formatMinutes = (minutes: number): string => {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m ? `${h} h ${m} min` : `${h} h`
}
