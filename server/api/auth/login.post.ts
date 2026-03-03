import { eq } from 'drizzle-orm'
import { openConnection } from '#server/db'
import { users } from '#server/db/schema'
import { generateJwtToken } from '#server/jwtModule'

export default defineEventHandler(async (event) => {
  const db = openConnection()
  const body = await readBody(event)

  try {
    if (!(body.username && body.password)) {
      throw createError({
        statusCode: StatusCodes.BAD_REQUEST,
        statusMessage: 'Wymagane nazwa użytkownika i hasło!',
      })
    }

    const user = await db.query.users.findFirst({
      where: eq(users.username, body.username),
    })

    if (!user) {
      throw createError({
        statusCode: StatusCodes.NOT_FOUND,
        statusMessage: 'Użytkownik o podanej nazwie nie istnieje.',
      })
    }

    // const isMatch = await argon2.verify(user.password, body.password)
    const isMatch = user.password === body.password // lab1 requirements
    if (!isMatch) {
      throw createError({
        statusCode: StatusCodes.UNAUTHORIZED,
        statusMessage: 'Nieprawidłowe hasło',
      })
    }

    const { password, ...userWithoutPassword } = user

    return {
      token: generateJwtToken(event, userWithoutPassword),
      user: userWithoutPassword,
    }
  } catch (error) {
    console.error('Login error:', error)

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
