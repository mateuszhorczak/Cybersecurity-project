import type { z } from 'zod'

export async function validate<TSchema extends z.ZodTypeAny>(
  schema: TSchema,
  data: unknown,
): Promise<z.infer<TSchema>> {
  const parsed = schema.safeParse(data)
  if (!parsed.success) {
    throw createError({
      statusCode: StatusCodes.BAD_REQUEST,
      statusMessage: 'Validation error',
      data: parsed.error,
    })
  }
  return parsed.data
}
