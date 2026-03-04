import { defineEventHandler } from 'h3'
import { openConnection } from '#server/db'

export default defineEventHandler(async (event) => {
  try {
    const db = openConnection()
    const result = await db.query.users.findMany({
      columns: {
        id: true,
        username: true,
      },
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
