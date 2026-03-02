import { and, eq } from 'drizzle-orm'
import { defineEventHandler, getQuery } from 'h3'
import { openConnection } from '#server/db'
import { events } from '#server/db/schema'

export default defineEventHandler(async (event) => {
  const baseUrl = getRequestURL(event).origin
  const query = getQuery(event)
  const week = query.week as number
  const year = query.year as number

  if (!(week && year)) {
    throw createError({
      statusCode: StatusCodes.BAD_REQUEST,
      statusMessage: 'Missing week or year parameter',
    })
  }

  try {
    const db = openConnection()
    const result = await db
      .select({
        id: events.id,
        userId: events.userId,
        name: events.name,
        type: events.type,
        date: events.date,
        description: events.description,
        dateCreation: events.dateCreation,
      })
      .from(events)
      .where(and(eq(events.week, week), eq(events.year, year)))

    const encodedWeek = encodeURIComponent(week)
    const encodedYear = encodeURIComponent(year)
    const links = [
      {
        rel: 'self',
        href: `${baseUrl}/api/events/by-week?week=${encodedWeek}&year=${encodedYear}`,
        method: 'GET',
      },
      { rel: 'create', href: `${baseUrl}/api/events`, method: 'POST' },
      { rel: 'all-events', href: `${baseUrl}/api/events`, method: 'GET' },
      {
        rel: 'by-name',
        href: `${baseUrl}/api/events/by-name?name=event`,
        method: 'GET',
      },
      {
        rel: 'by-date',
        href: `${baseUrl}/api/events/by-date?date=27.05.2025`,
        method: 'GET',
      },
    ]

    return {
      data: result,
      links,
      _meta: {
        week,
        year,
        count: result.length,
      },
    }
  } catch (error) {
    console.error('Error processing request:', error)
    throw createError({
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      statusMessage: 'Internal Server Error',
      // @ts-expect-error silence error
      data: error.message,
    })
  }
})
