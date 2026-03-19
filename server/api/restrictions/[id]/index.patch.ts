import { eq } from 'drizzle-orm'
import { defineEventHandler } from 'h3'
import { openConnection } from '#server/db'
import { restrictions, restrictionsUpdateSchema } from '#server/db/schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const data = await validate(restrictionsUpdateSchema, body)
  const id = getRouterParam(event, 'id')
  const idNum = Number.parseInt(id as string, 10)

  if (!data.value) {
    throw createError({
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      statusMessage: 'Internal Server Error',
    })
  }

  try {
    const db = openConnection()

    await db
      .update(restrictions)
      .set({ value: data.value })
      .where(eq(restrictions.id, idNum))

    setResponseStatus(event, StatusCodes.OK)
    return {
      success: true,
    }
  } catch (error) {
    console.error('Error processing request:', error)
    throw createError({
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      statusMessage: 'Internal Server Error',
    })
  }
})
