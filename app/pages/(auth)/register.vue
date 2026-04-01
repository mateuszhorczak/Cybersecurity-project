<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})
</script>

<template>
  <UCard>
    <div class="space-y-4">
      <AtomsSubHeading>
        Stwórz nowe konto użytkownika
      </AtomsSubHeading>
      <USeparator />
      <MoleculesFormRegister />
    </div>
  </UCard>
</template>
