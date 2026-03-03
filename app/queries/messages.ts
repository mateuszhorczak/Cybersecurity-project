export const ROOT_KEY = 'messages' as const
export const KEYS = createCacheKeys(ROOT_KEY)

export const messagesList = defineQueryOptions(() => ({
  key: KEYS.list,
  query: async () => {
    return $fetch('/api/messages').catch((error) =>
      handleApiError(error, 'Wystąpił błąd podczas pobierania wiadomości'),
    )
  },
}))

export const messageById = defineQueryOptions(
  ({ messageId }: { messageId: number }) => ({
    key: KEYS.detailById(messageId),
    query: async () => {
      return $fetch(`/api/messages/${messageId}`).catch((error) =>
        handleApiError(error, 'Wystąpił błąd podczas pobierania konkretnej wiadomości'),
      )
    },
    enabled: Boolean(messageId),
  }),
)