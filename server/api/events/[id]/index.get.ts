import { eq } from 'drizzle-orm'
import { defineEventHandler } from 'h3'
import { openConnection } from '#server/db'
import { events } from '#server/db/schema'

export default defineEventHandler(async (event) => {
  const baseUrl = getRequestURL(event).origin
  const id = getRouterParam(event, 'id')
  const idNum = Number.parseInt(id as string, 10)

  if (!idNum) {
    throw createError({
      statusCode: StatusCodes.BAD_REQUEST,
      statusMessage: 'Missing id parameter',
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
      .where(eq(events.id, idNum))

    const links = [
      { rel: 'self', href: `${baseUrl}/api/events?id=1`, method: 'GET' },
      { rel: 'update', href: `${baseUrl}/api/events`, method: 'PUT' },
      { rel: 'delete', href: `${baseUrl}/api/events`, method: 'DELETE' },
      { rel: 'create', href: `${baseUrl}/api/events`, method: 'POST' },
      { rel: 'all-events', href: `${baseUrl}/api/events`, method: 'GET' },
      {
        rel: 'by-date',
        href: `${baseUrl}/api/events/by-date?date=27.05.2025`,
        method: 'GET',
      },
      {
        rel: 'by-week',
        href: `${baseUrl}/api/events/by-week?week=22&year=2025`,
        method: 'GET',
      },
    ]

    return {
      data: result[0],
      links,
      _meta: {
        searchQuery: id,
        count: 1,
        pattern: `%${id}%`,
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
