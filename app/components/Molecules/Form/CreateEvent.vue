<script setup lang="ts">
import { CalendarDate } from '@internationalized/date'
import type { FormError, FormSubmitEvent } from '@nuxt/ui'
import type * as z from 'zod'
import { eventInsertSchema } from '#server/db/schema'

const eventStore = useEventStore()
const auth = useAuthStore()

const currentDate = new Date()
const date = shallowRef(
  new CalendarDate(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    currentDate.getDate(),
  ),
)

const schema = eventInsertSchema
type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  name: undefined,
  type: undefined,
  description: undefined,
})

const validate: (state: Partial<Schema>) => FormError[] = (state) => {
  if (!auth.user) return []
  const { error } = schema.safeParse({
    ...state,
    userId: auth.user.id,
    date: date.value.toString(),
  })
  return handleValidationError(error)
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  if (!auth.user) return
  const newEvent = {
    userId: auth.user.id,
    name: event.data.name,
    type: event.data.type,
    date: date.value.toString(),
    description: event.data.description,
    week: getWeekNumber(date.value),
    month: date.value.month,
    year: date.value.year,
  }

  await eventStore.addEvent(newEvent)
  const router = useRouter()
  await router.push('/events')
}
</script>

<template>
  <UForm :validate="validate" :state="state" class="space-y-4" @submit="onSubmit">
    <AtomsInput v-model="state.name" icon="i-mdi-event" placeholder="Wpisz nazwę wydarzenia" variant="subtle"
      label="Nazwa wydarzenia" name="name" />

    <AtomsInput v-model="state.type" icon="i-mdi-event" placeholder="Wpisz typ wydarzenia" variant="subtle"
      label="Typ eventu" name="type" />

    <AtomsInput v-model="state.description" icon="i-mdi-event" placeholder="Wpisz opis wydarzenia" variant="subtle"
      label="Opis" name="description" />

    <AtomsInputCalendar v-model:date="date" label="Data" name="event-date" icon="i-mdi-calendar" />

    <AtomsButton icon="i-mdi-calendar-plus" label="Stwórz" size="lg" type="submit" variant="solid" />
  </UForm>
</template>
