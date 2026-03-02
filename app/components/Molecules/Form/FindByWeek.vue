<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import type * as z from 'zod'
import { eventSelectWeekYearSchema } from '#server/db/schema'

const MIN_YEAR = 2000
const MAX_YEAR = 2100
const MIN_WEEK = 1
const MAX_WEEK = 53

const eventStore = useEventStore()

const schema = eventSelectWeekYearSchema
type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  week: undefined,
  year: undefined,
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  if (!(event.data.week && event.data.year)) return
  await eventStore.getEventsByWeek(event.data.week, event.data.year)
}
</script>

<template>
  <UForm
    :schema="schema"
    :state="state"
    class="space-y-4"
    @submit="onSubmit"
  >
    <AtomsInputNumber
      v-model="state.week"
      icon="i-mdi-event"
      placeholder="22"
      variant="subtle"
      label="Tydzień roku"
      name="event-week"
      :min="MIN_WEEK"
      :max="MAX_WEEK"
    />

    <AtomsInputNumber
      v-model="state.year"
      icon="i-mdi-event"
      placeholder="2025"
      variant="subtle"
      label="Rok"
      name="event-year"
      :min="MIN_YEAR"
      :max="MAX_YEAR"
    />

    <AtomsButton
      icon="i-mdi-calendar-search"
      label="Wyszukaj"
      size="lg"
      type="submit"
      variant="solid"
    />
  </UForm>
</template>
