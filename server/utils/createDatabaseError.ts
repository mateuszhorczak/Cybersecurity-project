export async function createDatabaseError(error: unknown): Promise<never> {
  console.error('Database error:', error)
  throw createError({
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    statusMessage: 'Wewnętrzny błąd serwera',
  })
}
