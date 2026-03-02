<script setup lang="ts">
const route = useRoute()
const eventStore = useEventStore()

const id = route.params.id
const idNum = Number.parseInt(id as string, 10)
await eventStore.getEventById(idNum)
</script>

<template>
  <AtomsSubHeading class="my-4">
    Edycja wydarzenia
  </AtomsSubHeading>
  <MoleculesFormUpdateEvent
    v-if="eventStore.singleEvent"
    :id="eventStore.singleEvent.id"
    :name="eventStore.singleEvent.name"
    :type="eventStore.singleEvent.type"
    :date="eventStore.singleEvent.date"
    :description="eventStore.singleEvent?.description"
    :user-id="eventStore.singleEvent?.userId"
    :date-creation="eventStore.singleEvent?.dateCreation"
  />
</template>
