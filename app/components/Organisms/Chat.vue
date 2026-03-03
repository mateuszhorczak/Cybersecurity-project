<script setup lang="ts">
const messageStore = useMessageStore()
const auth = useAuthStore()

const text = ref()
const clearText = () => text.value = ''
const sendMessage = async () => {
  if (!(text.value.trim() && auth.user)) return
  await messageStore.createMessage({ userId: auth.user?.id, text: text.value.trim() })
  clearText()
}

const actions = ref([
  {
    label: 'Usuń',
    icon: 'i-mdi-delete',
    onClick: (e: MouseEvent, message: { id: string, metadata: { userId: number } }) => messageStore.deleteMessage(parseInt(message.id, 10)),
  },
])
const messageArray = computed(() => transformMessageArray(messageStore.messages?.map((item) => ({ ...item, loggedUser: auth.user?.id ?? 0 })) ?? []))
</script>

<template>
  <UCard>
    <UChatMessages class="max-h-[800px] overflow-y-auto">
      <UChatMessage
        v-for="(message, index) in messageArray"
        :key="index"
        v-bind="message"
        icon="i-mdi-account"
        variant="soft"
        :actions="message.loggedUser === message.userId ? actions : []"
      />
    </UChatMessages>
    
      <UChatPrompt
      v-model="text"
      variant="soft"
    >
      <UChatPromptSubmit
        icon="i-mdi-send"
        @click="sendMessage"
      />
    </UChatPrompt>
  </UCard>
</template>
