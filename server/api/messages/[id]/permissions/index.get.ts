import { eq } from 'drizzle-orm'
import { defineEventHandler } from 'h3'
import { openConnection } from '#server/db'
import { messagePermissions } from '~~/server/db/schema'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const idNum = Number.parseInt(id as string, 10)

  try {
    const db = openConnection()
    const result = await db.query.messagePermissions.findMany({
      where: eq(messagePermissions.messageId, idNum),
    })

    setResponseStatus(event, StatusCodes.OK)
    return result
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
