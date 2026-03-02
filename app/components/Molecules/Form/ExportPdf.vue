<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'

const JANUARY = 1
const DECEMBER = 12
const MIN_YEAR = 2000
const MAX_YEAR = 2100

const eventStore = useEventStore()

const schema = z.object({
  month: z.number(),
  year: z.number(),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  month: undefined,
  year: undefined,
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  await eventStore.getEventPdf(event.data.month, event.data.year)
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
      v-model="state.month"
      icon="i-mdi-event"
      placeholder="5"
      variant="subtle"
      label="Miesiąc"
      name="event-month"
      :min="JANUARY"
      :max="DECEMBER"
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
      icon="i-mdi-file-export"
      label="Eksportuj"
      size="lg"
      type="submit"
      variant="solid"
    />
  </UForm>
</template>
