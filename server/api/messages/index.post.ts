import { defineEventHandler } from 'h3'
import { openConnection } from '#server/db'
import { messageInsertSchema, messages } from '#server/db/schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  messageInsertSchema.safeParse(messages)
  const data = await validate(messageInsertSchema, body)

  try {
    const db = openConnection()

    const newMessage = {
      ...data,
      dateCreation: new Date().toISOString(),
    }

    await db.insert(messages).values(newMessage)

    setResponseStatus(event, StatusCodes.CREATED)
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
