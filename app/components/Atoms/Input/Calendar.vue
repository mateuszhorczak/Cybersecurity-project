<script setup lang="ts">
import type { CalendarDate } from '@internationalized/date'
import { DateFormatter, getLocalTimeZone } from '@internationalized/date'
import type { ButtonProps, FormFieldProps } from '@nuxt/ui'

interface Props {
  label: FormFieldProps['label']
  name: FormFieldProps['name']
  icon: ButtonProps['icon']
}

const props = defineProps<Props>()

const date = defineModel<CalendarDate>('date')
const df = new DateFormatter('pl-PL', {
  dateStyle: 'medium',
})
</script>

<template>
  <UFormField
    :label="props.label"
    :name="props.name"
  >
    <UPopover>
      <UButton
        color="neutral"
        variant="subtle"
        size="lg"
        :icon="props.icon"
      >
        {{ date ? df.format(date.toDate(getLocalTimeZone())) : 'Wybierz datę' }}
      </UButton>

      <template #content>
        <UCalendar
          v-model="date"
          class="p-2"
        />
      </template>
    </UPopover>
    <slot name="button-in-group" />
  </UFormField>
</template>
