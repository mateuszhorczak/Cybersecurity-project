export const ROOT_KEY = 'restrictions' as const
export const KEYS = createCacheKeys(ROOT_KEY)

export const restrictionsList = defineQueryOptions(() => ({
  key: KEYS.list,
  query: async () => {
    return $fetch('/api/restrictions').catch((error) =>
      handleApiError(error, 'Wystąpił błąd podczas pobierania wiadomości'),
    )
  },
}))

export const restrictionById = defineQueryOptions(
  ({ restrictionId }: { restrictionId: number }) => ({
    key: KEYS.detailById(restrictionId),
    query: async () => {
      return $fetch(`/api/restrictions/${restrictionId}`).catch((error) =>
        handleApiError(
          error,
          'Wystąpił błąd podczas pobierania konkretnej wiadomości',
        ),
      )
    },
    enabled: Boolean(restrictionId) && restrictionId > 0,
  }),
)
