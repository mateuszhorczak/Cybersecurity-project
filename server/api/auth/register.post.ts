import argon2 from 'argon2'
import { openConnection } from '#server/db'
import { users } from '#server/db/schema'

export default defineEventHandler(async (event) => {
  const db = openConnection()
  const body = await readBody(event)

  try {
    if (!(body.username && body.password && body.email)) {
      throw createError({
        statusCode: StatusCodes.BAD_REQUEST,
        statusMessage: 'Wszystkie pola są wymagane!',
      })
    }

    const existingUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.username, body.username),
    })

    if (existingUser) {
      throw createError({
        statusCode: StatusCodes.CONFLICT,
        statusMessage: 'Nazwa użytkownika jest zajęta.',
      })
    }

    const existingEmail = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, body.email),
    })

    if (existingEmail) {
      throw createError({
        statusCode: StatusCodes.CONFLICT,
        statusMessage: 'Podany adres email ma już przypisane konto.',
      })
    }

    const hashedPassword = await argon2.hash(body.password)

    const [newUser] = await db
      .insert(users)
      .values({
        username: body.username,
        password: hashedPassword,
        email: body.email,
        dateCreation: new Date().toISOString(),
      })
      .returning()

    const userWithoutPassword = omit(newUser, ['password'])

    setResponseStatus(event, StatusCodes.CREATED)
    return {
      success: true,
      data: userWithoutPassword,
    }
  } catch (error) {
    console.error('Registration error:', error)

    // @ts-expect-error type error silence
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      statusMessage: 'Internal server error',
    })
  }
})
