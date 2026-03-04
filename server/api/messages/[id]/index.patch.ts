import { eq } from 'drizzle-orm'
import { defineEventHandler } from 'h3'
import { openConnection } from '#server/db'
import { messages, messageUpdateSchema } from '#server/db/schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const data = await validate(messageUpdateSchema, body)

  if (!data.id) {
    throw createError({
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      statusMessage: 'Internal Server Error',
    })
  }

  try {
    const db = openConnection()

    await db
      .update(messages)
      .set({ text: data.text })
      .where(eq(messages.id, data.id))

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
