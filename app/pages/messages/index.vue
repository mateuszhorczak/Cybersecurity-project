<script setup lang="ts">
const messageStore = useMessageStore()
await messageStore.fetchMessages()
</script>

<template>
  <OrganismsChat />
</template>
