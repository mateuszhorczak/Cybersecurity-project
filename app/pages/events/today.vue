<script setup lang="ts">
import { CalendarDate } from '@internationalized/date'

const eventStore = useEventStore()

const currentDate = new Date()
const date = shallowRef(
  new CalendarDate(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    currentDate.getDate(),
  ),
)
await eventStore.getEventsByDate(date.value.toString())
</script>

<template>
  <AtomsSubHeading class="my-4">
    Dzisiejsze wydarzenia
  </AtomsSubHeading>
  <OrganismsEvents />
</template>
