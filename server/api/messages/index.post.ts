import { defineEventHandler } from 'h3'
import { openConnection } from '#server/db'
import {
  messageInsertSchema,
  messagePermissions,
  messages,
} from '#server/db/schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const data = await validate(messageInsertSchema, body)

  try {
    const db = openConnection()

    const newMessage = {
      ...data,
      dateCreation: new Date().toISOString(),
    }

    const createdMessage = await db
      .insert(messages)
      .values(newMessage)
      .returning()

    if (
      createdMessage.length !== 1
      || !createdMessage[0]?.id
      || !createdMessage[0]?.userId
    ) {
      throw createError({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        statusMessage: 'Wystąpił błąd podczas wysyłania wiadomości',
      })
    }

    await db.insert(messagePermissions).values({
      userId: createdMessage[0].userId,
      messageId: createdMessage[0].id,
    })

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
