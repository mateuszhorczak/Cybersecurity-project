<script  setup lang="ts">
const text = defineModel<string>('text', { default: '' })
const isOpen = defineModel<boolean>('is-open', { default: false })
const editingMessageId = defineModel<number | null>('editing-message-id', {
  default: null,
})

const auth = useAuthStore()
const messageStore = useMessageStore()

const startEdit = (messageId: number, currentText: string) => {
  editingMessageId.value = messageId
  text.value = currentText
}

const openModal = (id: number) => {
  messageStore.selectedMessageId = id
  isOpen.value = true
}

const hasPermission = (message: Message): boolean => {
  if (!auth.user?.id) return false
  return message.messagePermissions.some(
    (permission) => permission.userId === auth.user?.id,
  )
}

const isAuthor = (message: Message): boolean => {
  if (!auth.user?.id) return false
  return message.userId === auth.user.id
}

const actionMap = {
  edit: {
    label: 'Edytuj',
    icon: 'i-mdi-pencil',
    handler: (message: Message) => startEdit(message.id, message.text),
  },
  delete: {
    label: 'Usuń',
    icon: 'i-mdi-delete',
    handler: (messageId: number) => messageStore.deleteMessage(messageId),
  },
  grantPermissions: {
    label: 'Nadaj uprawnienia',
    icon: 'i-mdi-shield-account',
    handler: (messageId: number) => openModal(messageId),
  },
}

const getActionsForMessage = (message: Message) => {
  const userIsAuthor = isAuthor(message)
  const userHasPermission = hasPermission(message)

  const editAction = {
    label: actionMap.edit.label,
    icon: actionMap.edit.icon,
    onClick: (_e: MouseEvent) => actionMap.edit.handler(message),
  }
  const deleteAction = {
    label: actionMap.delete.label,
    icon: actionMap.delete.icon,
    onClick: (_e: MouseEvent) => actionMap.delete.handler(message.id),
  }

  const grantPermissionsAction = {
    label: actionMap.grantPermissions.label,
    icon: actionMap.grantPermissions.icon,
    onClick: (_e: MouseEvent) => actionMap.grantPermissions.handler(message.id),
  }

  return userIsAuthor
    ? [editAction, deleteAction, grantPermissionsAction]
    : userHasPermission
      ? [editAction, deleteAction]
      : []
}

const messageArray = computed(() =>
  transformMessageArray(
    messageStore.messages?.map((item) => ({
      ...item,
      loggedUser: auth.user?.id ?? 0,
      actions: getActionsForMessage(item as Message),
    })) ?? [],
  ),
)
</script>

<template>
  <UChatMessages class="h-[800px] overflow-y-auto">
    <UChatMessage
      v-for="(message, index) in messageArray"
      :key="index"
      v-bind="message"
      :avatar="{
        icon: 'i-mdi-account-outline',
      }"
      variant="soft"
      :actions="message.actions"
    />
  </UChatMessages>
</template>
