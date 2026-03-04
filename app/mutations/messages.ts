import { defineMutation, useMutation } from '@pinia/colada'
import { KEYS as MESSAGE_KEYS } from '~/queries/messages'
import type { NewMessage } from '~~/shared/types/message'

export const useCreateMessage = defineMutation(() => {
  const cache = useQueryCache()

  const {
    mutateAsync: create,
    data: createdMessage,
    ...mutation
  } = useMutation({
    mutation: (message: NewMessage) =>
      $fetch<SuccessResponse>('/api/messages', {
        method: 'POST',
        body: message,
      }),

    onMutate: (message) => {
      const listKey = MESSAGE_KEYS.list
      const prevList = cache.getQueryData<Message[]>(listKey) || []

      let updatedList = prevList

      if (prevList.length > 0) {
        updatedList = [
          ...prevList,
          {
            // biome-ignore lint/style/noMagicNumbers: We're generating a negative random id here.
            id: (Math.random() * -1e3) ^ 0,
            ...message,
            dateCreation: new Date().toISOString(),
            messagePermissions: [],
          },
        ]

        cache.setQueryData(listKey, updatedList)
        cache.cancelQueries({ key: listKey })
      }

      return {
        prevList,
        listKey,
      }
    },

    onError: (error, _vars, ctx) => {
      handleApiError(error, 'Błąd podczas wysyłania wiadomości')

      if (ctx?.listKey && ctx?.prevList)
        cache.setQueryData(ctx.listKey, ctx.prevList)
    },

    onSettled: () => {
      useNuxtApp().$createSuccessToast({
        title: 'Wiadomość została poprawnie wysłana',
      })

      cache.invalidateQueries({ key: MESSAGE_KEYS.list })
    },
  })

  return { ...mutation, create, createdMessage }
})

export const useUpdateMessage = defineMutation(() => {
  const cache = useQueryCache()

  const {
    mutateAsync: update,
    data: updatedMessage,
    ...mutation
  } = useMutation({
    mutation: (message: EditMessagePayload) =>
      $fetch<SuccessResponse>(`/api/messages/${message.id}`, {
        method: 'PATCH',
        body: message,
      }),

    onMutate: (message) => {
      const listKey = MESSAGE_KEYS.list
      const detailKey = MESSAGE_KEYS.detailById(message.id)

      const prevList = cache.getQueryData<Message[]>(listKey) || []
      const prevDetail = cache.getQueryData<Message>(detailKey)

      let updatedList = prevList

      if (prevList.length > 0) {
        updatedList = prevList.map((existing) =>
          existing.id === message.id
            ? {
                ...existing,
                text: message.text,
              }
            : existing,
        )
        cache.setQueryData(listKey, updatedList)
        cache.cancelQueries({ key: listKey })
      }

      if (prevDetail !== undefined) {
        cache.setQueryData(detailKey, {
          ...prevDetail,
          text: message.text,
        })
        cache.cancelQueries({ key: detailKey })
      }

      return {
        prevList,
        listKey,
        prevDetail,
        detailKey,
      }
    },

    onError: (error, _vars, ctx) => {
      handleApiError(error, 'Wystąpił błąd podczas edycji wiadomości')

      if (ctx?.listKey && ctx?.prevList)
        cache.setQueryData(ctx.listKey, ctx.prevList)
      if (ctx?.detailKey && ctx?.prevDetail)
        cache.setQueryData(ctx.detailKey, ctx.prevDetail)
    },

    onSettled: (_data, _error, vars, _context) => {
      useNuxtApp().$createSuccessToast({
        title: 'Wiadomość została zmieniona poprawnie',
      })

      cache.invalidateQueries({ key: MESSAGE_KEYS.detailById(vars.id) })
      cache.invalidateQueries({ key: MESSAGE_KEYS.list })
    },
  })

  return { ...mutation, update, updatedMessage }
})

export const useDeleteMessage = defineMutation(() => {
  const cache = useQueryCache()

  const {
    mutateAsync: remove,
    data: response,
    ...mutation
  } = useMutation({
    mutation: async (messageId: number) =>
      $fetch<SuccessResponse>(`/api/messages/${messageId}`, {
        method: 'DELETE',
      }),

    onMutate: (messageId) => {
      const listKey = MESSAGE_KEYS.list
      const detailKey = MESSAGE_KEYS.detailById(messageId)

      const prevList = cache.getQueryData<Message[]>(listKey) || []
      const prevDetail = cache.getQueryData<Message>(detailKey)

      let updatedList = prevList

      if (prevList.length > 0) {
        updatedList = prevList.filter((s) => s.id !== messageId)
        cache.setQueryData(listKey, updatedList)
        cache.cancelQueries({ key: listKey })
      }

      if (prevDetail !== undefined) {
        cache.setQueryData(detailKey, null)
        cache.cancelQueries({ key: detailKey })
      }

      return {
        prevList,
        listKey,
        prevDetail,
        detailKey,
      }
    },

    onError: (error, _vars, ctx) => {
      handleApiError(error, 'Usuwanie wiadomości nie powiodło się')

      if (ctx?.listKey && ctx?.prevList)
        cache.setQueryData(ctx.listKey, ctx.prevList)
      if (ctx?.detailKey && ctx?.prevDetail)
        cache.setQueryData(ctx.detailKey, ctx.prevDetail)
    },

    onSettled: () => {
      useNuxtApp().$createSuccessToast({
        title: 'Poprawnie usunięto wiadomość',
      })
      cache.invalidateQueries({ key: MESSAGE_KEYS.list })
    },
  })

  return { ...mutation, remove, response }
})
