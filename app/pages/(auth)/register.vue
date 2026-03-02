<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})
</script>

<template>
  <UCard>
    <AtomsSubHeading class="mx-auto">
      Stwórz nowe konto użytkownika
    </AtomsSubHeading>
    <MoleculesFormRegister />
  </UCard>
</template>
