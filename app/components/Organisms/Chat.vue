<script setup lang="ts">
const text = ref('')
const editingMessageId = ref<number | null>(null)
const permissionModalIsOpen = ref(false)
</script>

<template>
  <UCard>
    <MoleculesChatMessages
      v-model:text="text"
      v-model:editing-message-id="editingMessageId"
      v-model:is-open="permissionModalIsOpen"
    />
    <MoleculesChatPrompt
      v-model:text="text"
      v-model:editing-message-id="editingMessageId"
    />
  </UCard>
  <MoleculesChatPermissionModal
    v-if="permissionModalIsOpen"
    v-model="permissionModalIsOpen"
  />
</template>
