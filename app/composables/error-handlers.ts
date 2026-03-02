import type { FormError } from '@nuxt/ui'
import type { ZodError } from 'zod'

export function handleValidationError(
  error: ZodError | undefined,
): FormError[] {
  if (!error) return []
  return error?.issues.map((e) => {
    return {
      name: e.path[0] as string,
      message: e.message,
    }
  })
}
