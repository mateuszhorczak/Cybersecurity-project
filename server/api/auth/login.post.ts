import { eq } from 'drizzle-orm'
import { openConnection } from '#server/db'
import { users } from '#server/db/schema'
import { generateJwtToken } from '#server/jwtModule'

export default defineEventHandler(async (event) => {
  const db = openConnection()
  const ipAddress = getIp(event)
  const body = await readBody(event)

  try {
    const restrictions = await db.query.restrictions.findMany()

    const FailureCountUntilBanned =
      restrictions[Restrictions.LockAttempts - 1]?.value
    const FailureCountUntilDelayed =
      restrictions[Restrictions.WarningAttempts - 1]?.value
    const LoginFailureDelay =
      restrictions[Restrictions.WarningTimeout - 1]?.value

    if (!(body.username && body.password)) {
      throw createError({
        statusCode: StatusCodes.BAD_REQUEST,
        statusMessage: 'Wymagane nazwa użytkownika i hasło!',
      })
    }

    if (
      !(
        FailureCountUntilBanned
        && FailureCountUntilDelayed
        && LoginFailureDelay
      )
    ) {
      throw createError({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        statusMessage: 'Internal server error',
      })
    }

    const ipFailureCount = await getLoginFailureCount({ ipAddress })
    if (ipFailureCount > FailureCountUntilBanned) {
      // Ban for 2 hours if more than `MAX_FAILURE_COUNT` failed attempts from a single IP Address
      // and add `LOGIN_FAILURE_DELAY` seconds delay for each attempt
      console.error(
        `[LOGIN] [ERROR] ${new Date().toISOString()} - Too many invalid login attempts detected for IP ${ipAddress}. Temporary ban applied with 20s delay.`,
      )

      await delayResponse(event, LoginFailureDelay)
      throw createError({
        statusCode: StatusCodes.FORBIDDEN,
        statusMessage: 'IP banned',
      })
    }

    // Check per-IP failures for this IP (more than `FAILURE_COUNT_UNTIL_DELAYED` in last hour for any user)
    if (ipFailureCount > FailureCountUntilDelayed) {
      console.warn(
        `[LOGIN] [WARN] ${new Date().toISOString()} - Too many login attempts from IP ${ipAddress}, count: ${ipFailureCount}`,
      )
      await delayResponse(event, LoginFailureDelay)
    }

    const user = await db.query.users.findFirst({
      where: eq(users.username, body.username),
    })

    if (!user) {
      console.warn(
        `[LOGIN] ${new Date().toISOString()} Login attempt of non-existent user - ${body.username} (${ipAddress})`,
      )

      await registerFailedLoginAttempt('user_not_found', { ipAddress })

      throw createError({
        statusCode: StatusCodes.NOT_FOUND,
        statusMessage: 'Użytkownik o podanej nazwie nie istnieje.',
      })
    }

    // Check per-user failures (more than `FAILURE_COUNT_UNTIL_DELAYED` in last hour from any IP)
    const userFailureCount = await getLoginFailureCount({ userId: user.id })
    if (userFailureCount > FailureCountUntilDelayed) {
      console.warn(
        `[LOGIN] [WARN] ${new Date().toISOString()} - Too many login attempts for user ${body.username} (IP: ${ipAddress}), count: ${userFailureCount}`,
      )
      await delayResponse(event, LoginFailureDelay)
    }

    // const isMatch = await argon2.verify(user.password, body.password)
    const isMatch = user.password === body.password // lab1 requirements
    if (!isMatch) {
      console.error(
        `[LOGIN] ${new Date().toISOString()} Failed login attempt for user ${body.username} (${ipAddress})`,
      )

      await registerFailedLoginAttempt('invalid_password', {
        ipAddress,
        userId: user.id,
      })

      throw createError({
        statusCode: StatusCodes.UNAUTHORIZED,
        statusMessage: 'Nieprawidłowe hasło',
      })
    }

    const { password, ...userWithoutPassword } = user

    console.info(
      `[LOGIN] ${new Date().toISOString()} Successful login for user ${body.username} (${ipAddress})`,
    )
    setResponseStatus(event, StatusCodes.OK)

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
