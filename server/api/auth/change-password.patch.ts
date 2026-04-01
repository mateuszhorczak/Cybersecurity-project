import argon2 from 'argon2'
import { eq } from 'drizzle-orm'
import { z } from 'zod/v4'
import { openConnection } from '#server/db'
import {
  passwordFragments,
  userPasswordSelectSchema,
  users,
} from '~~/server/db/schema'

const GENERATE_FRAGMENT_NUMBER = 15

export default defineEventHandler(async (event) => {
  const db = openConnection()
  const body = await readBody(event)

  const schema = userPasswordSelectSchema.extend({
    id: z.int(),
    oldPassword: z
      .string({ error: 'common.required' })
      .trim()
      .min(1, { error: 'common.required' }),
  })

  const data = await validate(schema, body)

  const user = await db.query.users
    .findFirst({
      where: eq(users.id, data.id),
    })
    .catch((error) => createDatabaseError(error))

  if (!user) {
    throw createError({
      statusCode: StatusCodes.NOT_FOUND,
      statusMessage: 'Nie znaleziono użytkownika',
    })
  }

  const isMatch = await argon2.verify(user.password, data.oldPassword)
  if (!isMatch) {
    throw createError({
      statusCode: StatusCodes.UNAUTHORIZED,
      statusMessage: 'Nieprawidłowe hasło',
    })
  }

  const hashedPassword = await argon2.hash(data.password)
  const rawFragments = await generatePasswordFragments(
    data.password,
    GENERATE_FRAGMENT_NUMBER,
  )

  const fragmentValues = rawFragments.map((f) => ({
    userId: user.id,
    startPosition: f.startPosition,
    length: f.length,
    fragmentHash: f.fragmentHash,
  }))

  try {
    await db.transaction(async (tx) => {
      await tx
        .update(users)
        .set({
          password: hashedPassword,
        })
        .where(eq(users.id, data.id))

      await tx
        .delete(passwordFragments)
        .where(eq(passwordFragments.userId, data.id))

      await tx.insert(passwordFragments).values(fragmentValues)
    })

    setResponseStatus(event, StatusCodes.OK)
    return {
      success: true,
    }
  } catch (error) {
    console.error('Password change error:', error)

    throw createError({
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      statusMessage: 'Wystąpił błąd podczas zmiany hasła.',
    })
  }
})
