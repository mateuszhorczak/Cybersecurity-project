<script setup lang="ts">
const model = defineModel<boolean>({ default: false })

const messageStore = useMessageStore()
const nuxtApp = useNuxtApp()

const { data: users } = await useLazyAsyncData('users', () =>
  $fetch<{ id: number; username: string }[]>('/api/users', {
    method: 'GET',
  }),
)

const { data: permissions, refresh: refreshPermissions } =
  await useLazyAsyncData(
    () => `permissions-${messageStore.selectedMessageId}`,
    () =>
      $fetch<{ userId: number; messageId: number }[]>(
        `/api/messages/${messageStore.selectedMessageId}/permissions`,
        { method: 'GET' },
      ),
    { watch: [() => messageStore.selectedMessageId] },
  )

const selectedUserIds = ref<number[]>([])

watch([model, permissions], ([isOpen, perms]) => {
  if (isOpen && perms) {
    selectedUserIds.value = perms.map((p) => p.userId)
  }
})

const hasPermission = (userId: number) => {
  return selectedUserIds.value.includes(userId)
}

const togglePermission = (userId: number) => {
  const index = selectedUserIds.value.indexOf(userId)
  if (index > -1) {
    selectedUserIds.value.splice(index, 1)
  } else {
    selectedUserIds.value.push(userId)
  }
}

const savePermissions = async () => {
  try {
    const toAdd = selectedUserIds.value
      .filter((userId) => !permissions.value?.some((p) => p.userId === userId))
      .map((userId) => ({
        userId,
        messageId: messageStore.selectedMessageId,
      }))

    const toRemove =
      permissions.value
        ?.filter((p) => !selectedUserIds.value.includes(p.userId))
        .map((p) => ({
          userId: p.userId,
          messageId: messageStore.selectedMessageId,
        })) || []

    await $fetch(
      `/api/messages/${messageStore.selectedMessageId}/permissions`,
      {
        method: 'PATCH',
        body: {
          add: toAdd,
          remove: toRemove,
        },
      },
    )

    nuxtApp.$createSuccessToast({
      title: 'Zmieniono uprawnienia!',
    })

    await refreshPermissions()

    model.value = false
  } catch (error) {
    console.error('Błąd podczas zapisywania uprawnień:', error)
    nuxtApp.$createErrorToast({
      title: 'Błąd podczas zapisywania uprawnień',
    })
  }
}
</script>

<template>
  <AtomsModal
    v-model="model"
    title="Zmień uprawnienia dla wiadomości"
    :is-footer="true"
  >
    <template #body>
      <div class="space-y-3">
        <div class="space-y-2">
          <p class="text-sm font-medium">
            Wybierz użytkowników z uprawnieniami:
          </p>

          <div class="space-y-1 max-h-64 overflow-y-auto">
            <div
              v-for="user in users"
              :key="user.id"
              class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              @click="togglePermission(user.id)"
            >
              <UCheckbox
                :model-value="hasPermission(user.id)"
                @click.stop="togglePermission(user.id)"
              />
              <div class="flex items-center gap-2 flex-1">
                <UAvatar
                  :alt="user.username"
                  size="sm"
                  icon="i-mdi-account-outline"
                />
                <span class="text-sm">{{ user.username }}</span>
              </div>
              <UBadge
                v-if="hasPermission(user.id)"
                color="primary"
                variant="soft"
                size="xs"
              >
                Uprawniony
              </UBadge>
            </div>
          </div>

          <div
            v-if="!(users && users.length)"
            class="text-sm text-gray-500 py-4 text-center"
          >
            Brak użytkowników
          </div>
        </div>

        <div class="pt-2 border-t">
          <p class="text-xs text-gray-500">
            Wybrano: {{ selectedUserIds.length }} użytkownik(ów)
          </p>
        </div>
      </div>
    </template>

    <template #footer>
      <AtomsButtonYes @click="savePermissions" />
      <AtomsButtonNo @click="model = false" />
    </template>
  </AtomsModal>
</template>
