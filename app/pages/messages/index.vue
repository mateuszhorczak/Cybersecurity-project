<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const messageStore = useMessageStore()
await messageStore.fetchMessages()
</script>

<template>
  <OrganismsChat />
</template>
