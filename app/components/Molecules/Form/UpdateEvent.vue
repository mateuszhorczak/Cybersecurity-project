<script setup lang="ts">
import { CalendarDate } from '@internationalized/date'
import type { FormSubmitEvent } from '@nuxt/ui'
import type * as z from 'zod'
import { eventUpdateSchema } from '#server/db/schema'
import type { BaseEvent } from '#shared/types/event' // import prevent Unresolvable type reference or unsupported built-in utility type bug

const props = defineProps<BaseEvent>()

const eventStore = useEventStore()
const router = useRouter()

const newDate = new Date()
const [year, month, day]: number[] = props.date.split('-').map(Number)
const date = shallowRef(
  new CalendarDate(
    year ?? newDate.getFullYear(),
    month ?? newDate.getMonth() + 1,
    day ?? newDate.getDay(),
  ),
)

const schema = eventUpdateSchema

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  name: props.name,
  type: props.type,
  description: props.description,
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const newEvent = {
    id: props.id,
    name: event.data.name,
    description: event.data.description,
    type: event.data.type,
    date: date.value.toString(),
    month: date.value.month,
    year: date.value.year,
    week: getWeekNumber(date.value),
    userId: props.userId,
    dateCreation: props.dateCreation,
  }

  await eventStore.updateEvent(newEvent)
  await router.push('/events')
}

const deleteEvent = async (id: number) => {
  await eventStore.deleteEvent(id)
  await router.push('/events')
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
      label="Nazwa eventu"
      name="name"
    />

    <AtomsInput
      v-model="state.type"
      icon="i-mdi-event"
      placeholder="Wpisz typ wydarzenia"
      variant="subtle"
      label="Typ eventu"
      name="type"
    />

    <AtomsInput
      v-model="state.description"
      icon="i-mdi-event"
      placeholder="Wpisz opis wydarzenia"
      variant="subtle"
      label="Opis"
      name="description"
    />

    <AtomsInputCalendar
      v-model:date="date"
      label="Data"
      name="date"
      icon="i-mdi-calendar"
    />

    <AtomsButton
      icon="i-mdi-calendar-edit"
      label="Edytuj"
      size="lg"
      variant="solid"
      type="submit"
    />

    <AtomsButton
      icon="i-mdi-calendar-remove"
      label="Usuń"
      size="lg"
      color="error"
      variant="solid"
      type="button"
      class="ml-2"
      @click="deleteEvent(props.id)"
    />
  </UForm>
</template>
