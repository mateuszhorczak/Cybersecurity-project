import { eq } from 'drizzle-orm'
import { defineEventHandler } from 'h3'
import { openConnection } from '#server/db'
import { events } from '#server/db/schema'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const idNum = Number.parseInt(id as string, 10)

  if (!idNum) {
    throw createError({
      statusCode: StatusCodes.BAD_REQUEST,
      statusMessage: 'Missing parameters',
    })
  }

  try {
    const db = openConnection()
    await db.delete(events).where(eq(events.id, idNum))
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
