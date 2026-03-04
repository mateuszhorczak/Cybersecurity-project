import { and, eq, inArray } from 'drizzle-orm'
import { defineEventHandler } from 'h3'
import { z } from 'zod/v4'
import { openConnection } from '#server/db'
import {
  messagePermissions,
  messagePermissionsUpdateSchema,
} from '#server/db/schema'

export default defineEventHandler(async (event) => {
  const messageId = Number(getRouterParam(event, 'id'))
  const body = await readBody<{
    add: { userId: number; messageId: number }[]
    remove: { userId: number; messageId: number }[]
  }>(event)

  const addItems = await validate(
    z.array(messagePermissionsUpdateSchema),
    body.add,
  )
  const removeItems = await validate(
    z.array(messagePermissionsUpdateSchema),
    body.remove,
  )

  if (!(addItems.length > 0 || removeItems.length > 0)) {
    throw createError({
      statusCode: StatusCodes.BAD_REQUEST,
      statusMessage: 'Internal Server Error',
    })
  }

  try {
    const db = openConnection()

    if (removeItems.length > 0) {
      const userIdsToRemove = body.remove.map((p) => p.userId)
      await db
        .delete(messagePermissions)
        .where(
          and(
            eq(messagePermissions.messageId, messageId),
            inArray(messagePermissions.userId, userIdsToRemove),
          ),
        )
    }

    if (addItems.length > 0) {
      await db.insert(messagePermissions).values(body.add)
    }

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
