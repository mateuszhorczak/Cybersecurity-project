<script setup lang="ts">
import { CalendarDate } from '@internationalized/date'

const currentDate = new Date()
const date = shallowRef(
  new CalendarDate(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    currentDate.getDate(),
  ),
)
const eventStore = useEventStore()

async function onSubmit() {
  const dateString = date.value.toString()
  await eventStore.getEventsByDate(dateString)
}
</script>

<template>
  <UFieldGroup>
    <AtomsInputCalendar
      v-model:date="date"
      label="Data"
      name="event-date"
      icon="i-mdi-calendar"
    >
      <template #button-in-group>
        <AtomsButton
          icon="i-mdi-calendar-search"
          label="Wyszukaj"
          size="lg"
          type="button"
          variant="solid"
          @click="onSubmit"
        />
      </template>
    </AtomsInputCalendar>
  </UFieldGroup>
</template>
