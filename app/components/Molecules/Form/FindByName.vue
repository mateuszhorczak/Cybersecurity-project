<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'

const eventStore = useEventStore()

const schema = z.object({
  name: z.string().trim().min(2),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  name: undefined,
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  await eventStore.getEventsByName(event.data.name)
}
</script>

<template>
  <UForm
    :schema="schema"
    :state="state"
    class="space-y-4"
    @submit="onSubmit"
  >
    <AtomsInput
      v-model="state.name"
      icon="i-mdi-event"
      placeholder="Wpisz nazwę wydarzenia"
      variant="subtle"
      label="Nazwa wydarzenia"
      name="event-name"
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
