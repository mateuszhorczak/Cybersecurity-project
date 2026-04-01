<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'

const MIN_USERNAME = 3

const emit = defineEmits<{
  challenged: [
    payload: {
      username: string
      challengeId: number
      startPosition: number
      length: number
      message: string
    },
  ]
}>()

const authStore = useAuthStore()
const toast = useToast()
const isSubmitting = ref(false)

const schema = z.object({
  username: z
    .string({ message: 'Wymagane' })
    .trim()
    .min(
      MIN_USERNAME,
      `Nazwa użytkownika musi składać się z co najmniej ${MIN_USERNAME} znaków`,
    ),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  username: undefined,
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isSubmitting.value = true
  try {
    const { success, data, error } = await authStore.getChallange(
      event.data.username,
    )

    if (success && data) {
      emit('challenged', {
        username: event.data.username,
        challengeId: data.challengeId,
        startPosition: data.startPosition,
        length: data.length,
        message: data.message,
      })
    } else {
      toast.add({
        title: 'Błąd pobierania wyzwania',
        description: error,
        color: 'error',
        icon: 'i-mdi-exclamation-thick',
      })
    }
  } catch {
    toast.add({
      title: 'Błąd',
      description: 'Wystąpił nieoczekiwany błąd',
      color: 'error',
      icon: 'i-mdi-exclamation-thick',
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
    <AtomsInput v-model="state.username" icon="i-mdi-account" placeholder="Wpisz nazwę użytkownika" variant="subtle"
      label="Nazwa użytkownika" name="username" />

    <AtomsButton icon="i-mdi-shield-key" label="Pobierz wyzwanie" size="lg" variant="solid" type="submit"
      :loading="isSubmitting" :disabled="isSubmitting" />
  </UForm>
</template>
