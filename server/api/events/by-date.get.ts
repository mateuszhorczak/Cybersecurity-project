import { eq } from 'drizzle-orm'
import { defineEventHandler, getQuery } from 'h3'
import { openConnection } from '#server/db'
import { events } from '#server/db/schema'

export default defineEventHandler(async (event) => {
  const baseUrl = getRequestURL(event).origin
  const query = getQuery(event)
  const date = query.date as string

  if (!date) {
    throw createError({
      statusCode: StatusCodes.BAD_REQUEST,
      statusMessage: 'Missing name parameter',
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
      .where(eq(events.date, date))

    const encodedDate = encodeURIComponent(date)
    const links = [
      {
        rel: 'self',
        href: `${baseUrl}/api/events/by-date?date=${encodedDate}`,
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
        rel: 'by-week',
        href: `${baseUrl}/api/events/by-week?week=22&year=2025`,
        method: 'GET',
      },
    ]

    return {
      data: result,
      links,
      _meta: {
        date,
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
