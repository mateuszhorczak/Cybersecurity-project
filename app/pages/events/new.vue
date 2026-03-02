<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})
</script>

<template>
  <UCard>
    <AtomsSubHeading class="my-4">
      Dodaj nowe wydarzenie
    </AtomsSubHeading>
    <MoleculesFormCreateEvent />
  </UCard>
</template>
