<script setup lang="ts">
import type { FormFieldProps, InputProps } from '@nuxt/ui'

enum PasswordStrength {
  None = 0,
  Weak = 2,
  Medium = 3,
  Good = 4,
}

const MIN_PASSWORD = 12

interface Props {
  placeholder: InputProps['placeholder']
  variant: InputProps['variant']
  icon: InputProps['icon']
  label: FormFieldProps['label']
  name: FormFieldProps['name']
  help?: FormFieldProps['help']
}

const props = defineProps<Props>()
const model = defineModel<string>({ default: '' })

const show = ref(false)

function checkStrength(str: string) {
  const requirements = [
    {
      regex: /.{12,}/,
      text: `Wymagane co najmniej ${MIN_PASSWORD} znaków`,
    },
    { regex: /\d/, text: 'Wymagana co najmniej jedna liczba' },
    { regex: /[a-z]/, text: 'Wymagana co najmniej jedna mała litera' },
    { regex: /[A-Z]/, text: 'Wymagana co najmniej jedna duża litera' },
    {
      regex: /[^a-zA-Z0-9]/,
      text: 'Wymagany co najmniej jeden znak specjalny',
    },
  ]

  return requirements.map((req) => ({
    met: req.regex.test(str),
    text: req.text,
  }))
}

const strength = computed(() => checkStrength(model.value))
const score = computed(() => strength.value.filter((req) => req.met).length)

const PASSWORD_STRENGTH_COLOR = {
  [PasswordStrength.None]: 'neutral',
  [PasswordStrength.Weak]: 'error',
  [PasswordStrength.Medium]: 'warning',
  [PasswordStrength.Good]: 'info',
} as const

const color = computed(() => {
  for (const [threshold, color] of Object.entries(PASSWORD_STRENGTH_COLOR)) {
    if (score.value <= Number(threshold)) return color
  }

  return 'success'
})

const PASSWORD_STRENGTH_MSG = {
  [PasswordStrength.None]: 'Wprowadź hasło',
  [PasswordStrength.Weak]: 'Słabe hasło',
  [PasswordStrength.Medium]: 'Średnie hasło',
  [PasswordStrength.Good]: 'Dobre hasło',
}

const text = computed(() => {
  for (const [threshold, message] of Object.entries(PASSWORD_STRENGTH_MSG)) {
    if (score.value <= Number(threshold)) return message
  }

  return 'Silne hasło'
})
</script>

<template>
  <div class="space-y-2">
    <UFormField
      :label="props.label"
      :name="props.name"
    >
      <UInput
        v-model="model"
        :icon="props.icon"
        :placeholder="props.placeholder"
        :color="color"
        :type="show ? 'text' : 'password'"
        :ui="{ trailing: 'pe-1' }"
        :aria-invalid="score < 5"
        aria-describedby="password-strength"
        :variant="props.variant"
        class="w-full"
      >
        <template #trailing>
          <UButton
            color="neutral"
            variant="link"
            size="sm"
            :icon="show ? 'i-mdi-eye-off' : 'i-mdi-eye'"
            :aria-label="show ? 'Schowaj hasło' : 'Pokaż hasło'"
            :aria-pressed="show"
            aria-controls="password"
            class="cursor-pointer"
            @click="show = !show"
          />
        </template>
      </UInput>
    </UFormField>

    <UProgress
      :color="color"
      :indicator="text"
      :model-value="score"
      :max="5"
      size="sm"
    />

    <p
      id="password-strength"
      class="text-sm font-medium"
    >
      {{ text }}. {{ 'musi zawierać' }}:
    </p>

    <ul
      class="space-y-1"
      aria-label="Wymagania hasła"
    >
      <li
        v-for="req in strength"
        :key="req.text"
        class="flex gap-0.5 items-center"
        :class="req.met ? 'text-success' : 'text-muted'"
      >
        <UIcon
          :name="req.met ? 'i-mdi-check-circle-outline' : 'i-mdi-close-circle-outline'"
          class="size-4 shrink-0"
        />

        <span class="text-xs font-light">
          {{ req.text }}
          <span class="sr-only">
            {{ req.met ? ' - Requirement met' : ' - Requirement not met' }}
          </span>
        </span>
      </li>
    </ul>
  </div>
</template>
