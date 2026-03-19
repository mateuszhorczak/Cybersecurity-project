import { defineMutation, useMutation } from '@pinia/colada'
import { KEYS as RESTRICTION_KEYS } from '~/queries/restrictions'

export const useUpdateRestriction = defineMutation(() => {
  const cache = useQueryCache()

  const {
    mutateAsync: update,
    data: updatedRestriction,
    ...mutation
  } = useMutation({
    mutation: (restriction: EditRestrictionPayload) =>
      $fetch<SuccessResponse>(`/api/restrictions/${restriction.id}`, {
        method: 'PATCH',
        body: restriction,
      }),

    onMutate: (restriction) => {
      const listKey = RESTRICTION_KEYS.list
      const detailKey = RESTRICTION_KEYS.detailById(restriction.id)

      const prevList = cache.getQueryData<Restriction[]>(listKey) || []
      const prevDetail = cache.getQueryData<Restriction>(detailKey)

      let updatedList = prevList

      if (prevList.length > 0) {
        updatedList = prevList.map((existing) =>
          existing.id === restriction.id
            ? {
                ...existing,
                value: restriction.value,
              }
            : existing,
        )
        cache.setQueryData(listKey, updatedList)
        cache.cancelQueries({ key: listKey })
      }

      if (prevDetail !== undefined) {
        cache.setQueryData(detailKey, {
          ...prevDetail,
          value: restriction.value,
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
      handleApiError(error, 'Wystąpił błąd podczas edycji restrykcji')

      if (ctx?.listKey && ctx?.prevList)
        cache.setQueryData(ctx.listKey, ctx.prevList)
      if (ctx?.detailKey && ctx?.prevDetail)
        cache.setQueryData(ctx.detailKey, ctx.prevDetail)
    },

    onSettled: (_data, _error, vars, _context) => {
      useNuxtApp().$createSuccessToast({
        title: 'Poprawnie zmieniono restrykcje',
      })

      cache.invalidateQueries({ key: RESTRICTION_KEYS.detailById(vars.id) })
      cache.invalidateQueries({ key: RESTRICTION_KEYS.list })
    },
  })

  return { ...mutation, update, updatedRestriction }
})
