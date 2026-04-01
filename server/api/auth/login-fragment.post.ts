import argon2 from 'argon2'
import { eq } from 'drizzle-orm'
import { openConnection } from '#server/db'
import { users } from '#server/db/schema'
import { generateJwtToken } from '#server/jwtModule'

export default defineEventHandler(async (event) => {
  const db = openConnection()
  const ipAddress = getIp(event)
  const body = await readBody(event)

  const restrictions = await db.query.restrictions.findMany()
  if (restrictions.length === 0) {
    throw createError({
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      statusMessage: 'Internal server error',
    })
  }

  const FailureCountUntilBanned = restrictions.find(
    (item) => item.id === Restrictions.LockAttempts,
  )?.value
  const FailureCountUntilDelayed = restrictions.find(
    (item) => item.id === Restrictions.WarningAttempts,
  )?.value
  const LoginFailureDelay = restrictions.find(
    (item) => item.id === Restrictions.WarningTimeout,
  )?.value

  if (
    !(FailureCountUntilBanned && FailureCountUntilDelayed && LoginFailureDelay)
  ) {
    throw createError({
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      statusMessage: 'Internal server error',
    })
  }

  if (!(body.username && body.challengeId && body.fragment)) {
    throw createError({
      statusCode: StatusCodes.BAD_REQUEST,
      statusMessage: 'Wymagane: username, challengeId i fragment',
    })
  }

  const ipFailureCount = await getLoginFailureCount({ ipAddress })
  if (ipFailureCount > FailureCountUntilBanned) {
    await delayResponse(event, LoginFailureDelay)
    throw createError({
      statusCode: StatusCodes.FORBIDDEN,
      statusMessage: 'IP banned',
    })
  }
  if (ipFailureCount > FailureCountUntilDelayed)
    await delayResponse(event, LoginFailureDelay)

  const user = await db.query.users.findFirst({
    where: eq(users.username, body.username),
    with: { passwordFragments: true },
  })

  if (!user) {
    await registerFailedLoginAttempt('user_not_found', { ipAddress })
    throw createError({
      statusCode: StatusCodes.NOT_FOUND,
      statusMessage: 'Użytkownik nie istnieje',
    })
  }

  const userFailureCount = await getLoginFailureCount({ userId: user.id })
  if (userFailureCount > FailureCountUntilDelayed)
    await delayResponse(event, LoginFailureDelay)

  const selected = user.passwordFragments.find((f) => f.id === body.challengeId)
  if (!selected)
    throw createError({
      statusCode: StatusCodes.BAD_REQUEST,
      statusMessage: 'Nieprawidłowe wyzwanie',
    })

  const isMatch = await argon2.verify(selected.fragmentHash, body.fragment)
  if (!isMatch) {
    await registerFailedLoginAttempt('invalid_password', {
      ipAddress,
      userId: user.id,
    })
    throw createError({
      statusCode: StatusCodes.UNAUTHORIZED,
      statusMessage: 'Nieprawidłowy fragment hasła',
    })
  }

  console.info(
    `[FRAGMENT LOGIN] ${new Date().toISOString()} Success for ${body.username}`,
  )

  const { password, passwordFragments: _, ...userWithoutPassword } = user
  setResponseStatus(event, StatusCodes.OK)

  return {
    token: generateJwtToken(event, userWithoutPassword),
    user: userWithoutPassword,
  }
})
