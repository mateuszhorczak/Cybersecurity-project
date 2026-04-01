import { eq } from 'drizzle-orm'
import { openConnection } from '#server/db'
import { users } from '#server/db/schema'

export default defineEventHandler(async (event) => {
  const db = openConnection()
  const body = await readBody(event)
  const username = body.username

  if (!username) {
    throw createError({
      statusCode: StatusCodes.BAD_REQUEST,
      statusMessage: 'Nazwa użytkownika jest wymagana',
    })
  }

  const user = await db.query.users.findFirst({
    where: eq(users.username, username),
    with: { passwordFragments: true },
  })

  if (!user)
    throw createError({
      statusCode: StatusCodes.NOT_FOUND,
      statusMessage: 'Użytkownik nie istnieje',
    })
  if (user.passwordFragments.length === 0) {
    throw createError({
      statusCode: StatusCodes.BAD_REQUEST,
      statusMessage:
        'Brak aktywnych fragmentów – zaloguj się używając pełnego hasła',
    })
  }

  const randomFragment =
    user.passwordFragments[
      Math.floor(Math.random() * user.passwordFragments.length)
    ]

  if (!randomFragment) {
    throw createError({
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      statusMessage: 'Wewnętrzny błąd serwera',
    })
  }

  return {
    challengeId: randomFragment.id,
    startPosition: randomFragment.startPosition,
    length: randomFragment.length,
    message: `Podaj fragment hasła od pozycji ${randomFragment.startPosition + 1} (długość ${randomFragment.length} znaków)`,
  }
})
