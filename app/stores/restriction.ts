import { useUpdateRestriction } from '~/mutations/restrictions'

import { restrictionById, restrictionsList } from '~/queries/restrictions'

export const useRestrictionStore = defineStore('restrictionStore', () => {
  const selectedRestrictionId = ref()

  const { data: restrictions, refresh: fetchRestrictions } =
    useQuery(restrictionsList)
  const { data: singleRestriction, refresh: fetchRestrictionById } = useQuery(
    () =>
      restrictionById({
        restrictionId: selectedRestrictionId.value,
      }),
  )

  const { update: updateRestriction } = useUpdateRestriction()

  return {
    restrictions,
    singleRestriction,
    selectedRestrictionId,
    updateRestriction,
    fetchRestrictions,
    fetchRestrictionById,
  }
})
