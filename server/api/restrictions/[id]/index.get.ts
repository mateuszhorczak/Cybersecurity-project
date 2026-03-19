import { defineEventHandler } from 'h3'
import { openConnection } from '#server/db'

export default defineEventHandler(async (event) => {
  try {
    const db = openConnection()
    const id = getRouterParam(event, 'id')
    const idNum = Number.parseInt(id as string, 10)
    const result = await db.query.restrictions.findFirst({
      where: (restrictions, { eq }) => eq(restrictions.id, idNum),
    })

    setResponseStatus(event, StatusCodes.OK)
    return result?.value
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
