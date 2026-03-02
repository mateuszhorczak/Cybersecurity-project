<script setup lang="ts">
import type { FormFieldProps, InputNumberProps } from '@nuxt/ui'

interface Props {
  placeholder: InputNumberProps['placeholder']
  variant: InputNumberProps['variant']
  min?: InputNumberProps['min']
  max?: InputNumberProps['max']
  label: FormFieldProps['label']
  name: FormFieldProps['name']
  help?: FormFieldProps['help']
}

const props = defineProps<Props>()

const model = defineModel<number>()
</script>

<template>
  <UFormField
    :label="props.label"
    :help="props.help"
    :name="props.name"
  >
    <UInputNumber
      v-model="model"
      :placeholder="props.placeholder"
      :variant="props.variant"
      :min="props.min"
      :max="props.max"
    />
  </UFormField>
</template>
