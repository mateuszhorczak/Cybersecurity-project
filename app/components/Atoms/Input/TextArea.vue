<script setup lang="ts">
import type { FormFieldProps, TextareaProps } from '@nuxt/ui'

interface Props {
  icon: TextareaProps['icon']
  placeholder: TextareaProps['placeholder']
  variant: TextareaProps['variant']
  label: FormFieldProps['label']
  name: FormFieldProps['name']
  help?: FormFieldProps['help']
}

const props = defineProps<Props>()

const model = defineModel<string>({ default: '' })
</script>

<template>
  <UFormField :label="props.label" :help="props.help" :name="props.name">
    <UTextarea
      v-model="model" :icon="props.icon" :placeholder="props.placeholder"
      :variant="props.variant" autoresize class="w-full" />
  </UFormField>
</template>