<script setup lang="ts">
import type { FormFieldProps, InputProps } from '@nuxt/ui'

interface Props {
  icon: InputProps['icon']
  placeholder: InputProps['placeholder']
  variant: InputProps['variant']
  label: FormFieldProps['label']
  name: FormFieldProps['name']
  help?: FormFieldProps['help']
}

const props = defineProps<Props>()
const model = defineModel<string>({ default: '' })

const show = ref(false)
</script>

<template>
  <UFormField
    :label="props.label"
    :help="props.help"
    :name="props.name"
  >
    <UInput
      v-model="model"
      :icon="props.icon"
      :placeholder="props.placeholder"
      :type="show ? 'text' : 'password'"
      class="w-full"
      :variant="props.variant"
      :ui="{ trailing: 'pe-1' }"
    >
      <template #trailing>
        <UButton
          color="neutral"
          variant="link"
          size="sm"
          :icon="show ? 'i-mdi-eye-off' : 'i-mdi-eye'"
          :aria-label="show ? 'Ukryj hasło' : 'Pokaż hasło'"
          :aria-pressed="show"
          aria-controls="password"
          class="cursor-pointer"
          @click="show = !show"
        />
      </template>
    </UInput>
  </UFormField>
</template>
