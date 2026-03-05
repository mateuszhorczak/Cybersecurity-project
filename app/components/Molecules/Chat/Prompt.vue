<script  setup lang="ts">
const text = defineModel<string>('text', { default: '' })
const editingMessageId = defineModel<number | null>('editing-message-id', {
  default: null,
})

const messageStore = useMessageStore()
const auth = useAuthStore()

const isEditMode = computed(() => editingMessageId.value !== null)

const clearText = () => {
  text.value = ''
  editingMessageId.value = null
}

const cancelEdit = () => clearText()

const editMessage = async () => {
  if (!(text.value.trim() && auth.user && editingMessageId.value)) return

  await messageStore.updateMessage({
    id: editingMessageId.value,
    userId: auth.user.id,
    text: text.value.trim(),
  })
  clearText()
}

const sendMessage = async () => {
  if (!(text.value.trim() && auth.user)) return

  await messageStore.createMessage({
    userId: auth.user?.id,
    text: text.value.trim(),
  })
  clearText()
}

const handleSubmit = async () => {
  const promise = isEditMode.value ? editMessage() : sendMessage()
  await promise
}
</script>

<template>
  <UChatPrompt
    v-model="text"
    variant="soft"
    @keydown.enter.exact.prevent="handleSubmit"
  >
    <div
      v-if="isEditMode"
      class="flex"
    >
      <UButton
        icon="i-mdi-close"
        color="neutral"
        variant="ghost"
        size="sm"
        aria-label="Anuluj edycję"
        @click="cancelEdit"
      />

      <UChatPromptSubmit
        icon="i-mdi-pencil"
        @click="editMessage"
      />
    </div>

    <UChatPromptSubmit
      v-else
      icon="i-mdi-send"
      @click="sendMessage"
    />
  </UChatPrompt>
</template>
