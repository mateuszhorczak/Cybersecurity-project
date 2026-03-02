<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})
</script>

<template>
  <UCard>
    <AtomsSubHeading>Zaloguj się do konta użytkownika</AtomsSubHeading>
    <MoleculesFormLogin />
  </UCard>
</template>
