<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})
</script>

<template>
  <AtomsSubHeading class="my-4">
    Wyeksportuj wydarzenia do pliku pdf
  </AtomsSubHeading>
  <MoleculesFormExportPdf />
</template>
