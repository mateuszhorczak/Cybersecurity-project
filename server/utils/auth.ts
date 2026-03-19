import { and, count, eq, gt } from 'drizzle-orm'
import { openConnection } from '#server/db'
import { failedLoginAttempts } from '~~/server/db/schema'

const DEFAULT_SINCE_TIME_MS = 3600000 // 1 hour

type Filters = NonNullableFields<typeof failedLoginAttempts.$inferSelect>
type AttemptData = Omit<typeof failedLoginAttempts.$inferInsert, 'reason'>

export const getLoginFailureCount = async (
  filters: Partial<Filters>,
  since = new Date(Date.now() - DEFAULT_SINCE_TIME_MS),
) => {
  const db = openConnection()
  const failures = await db
    .select({ count: count() })
    .from(failedLoginAttempts)
    .where(
      and(
        ...(
          Object.entries(filters) as [keyof Filters, Filters[keyof Filters]][]
        ).map(([key, value]) => eq(failedLoginAttempts[key], value)),
        // @ts-expect-error type never
        gt(failedLoginAttempts.attemptTime, since),
      ),
    )

  return failures[0]?.count ?? 0
}

export async function registerFailedLoginAttempt(
  reason: 'invalid_password',
  filters: Pick<AttemptData, 'ipAddress' | 'userId'>,
): Promise<void>

export async function registerFailedLoginAttempt(
  reason: 'user_not_found',
  filters: Pick<AttemptData, 'ipAddress'>,
): Promise<void>

export async function registerFailedLoginAttempt(
  reason: string,
  filters: AttemptData,
) {
  const db = openConnection()
  await db.insert(failedLoginAttempts).values({
    ...filters,
    reason,
  })
}
