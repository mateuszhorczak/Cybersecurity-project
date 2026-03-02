import { sql } from 'drizzle-orm'
import { defineEventHandler, getQuery } from 'h3'
import { openConnection } from '#server/db'
import { events } from '#server/db/schema'

export default defineEventHandler(async (event) => {
  const baseUrl = getRequestURL(event).origin
  const query = getQuery(event)
  const name = query.name as string

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
      .where(sql`${events.name} LIKE ${`%${name}%`}`)

    const encodedName = encodeURIComponent(name)

    const links = [
      {
        rel: 'self',
        href: `${baseUrl}/api/events/by-name?name=${encodedName}`,
        method: 'GET',
      },
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
      data: result,
      links,
      _meta: {
        searchQuery: name,
        count: result.length,
        pattern: `%${name}%`,
      },
    }
  } catch (error) {
    console.error('Error processing request:', error)
    throw createError({
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      statusMessage: 'Internal Server Error',
    })
  }
})
