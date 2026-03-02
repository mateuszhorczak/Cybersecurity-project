import type { CalendarDate } from '@internationalized/date'

const DAYS_IN_WEEK = 7
const MS_PER_DAY = 86400000
const ISO_WEEK_ANCHOR_DAY = 4 // thursday define first week in year

export const getWeekNumber = (date: CalendarDate) => {
  const d = new Date(date.year, date.month - 1, date.day)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + ISO_WEEK_ANCHOR_DAY - (d.getDay() || DAYS_IN_WEEK))
  const yearStart = new Date(d.getFullYear(), 0, 1)
  return Math.ceil(
    ((d.getTime() - yearStart.getTime()) / MS_PER_DAY + 1) / DAYS_IN_WEEK,
  )
}
