<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
})
</script>

<template>
  <AtomsSubHeading>Zmień hasło użytkownika</AtomsSubHeading>
  <MoleculesFormChangePassword />
</template>>