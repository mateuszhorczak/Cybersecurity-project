import argon2 from 'argon2'
import { openConnection } from '#server/db'
import { passwordFragments, users } from '#server/db/schema'

const MIN_PASSWORD = 12
const MAX_PASSWORD = 18
const GENERATE_FRAGMENT_NUMBER = 15

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

    if (
      body.password.length < MIN_PASSWORD
      || body.password.length > MAX_PASSWORD
    ) {
      throw createError({
        statusCode: StatusCodes.BAD_REQUEST,
        statusMessage: `Hasło musi mieć od ${MIN_PASSWORD} do ${MAX_PASSWORD} znaków.`,
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

    if (!newUser) {
      throw createError({
        statusCode: StatusCodes.BAD_REQUEST,
        statusMessage: 'Registration error',
      })
    }

    const rawFragments = await generatePasswordFragments(
      body.password,
      GENERATE_FRAGMENT_NUMBER,
    )
    const fragmentValues = rawFragments.map((f) => ({
      userId: newUser.id,
      startPosition: f.startPosition,
      length: f.length,
      fragmentHash: f.fragmentHash,
    }))

    await db.insert(passwordFragments).values(fragmentValues)

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
