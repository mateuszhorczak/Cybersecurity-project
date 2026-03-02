<script setup lang="ts">
const eventStore = useEventStore()
eventStore.clearEventsList()
</script>

<template>
  <AtomsSubHeading class="my-4">
    Wyszukaj wydarzenia po tygodniu
  </AtomsSubHeading>
  <MoleculesFormFindByWeek />
  <OrganismsEvents />
</template>
