<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'

const MIN_USERNAME = 3
const MIN_PASSWORD = 8

const authStore = useAuthStore()
const toast = useToast()
const router = useRouter()
const isSubmitting = ref(false)

const schema = z.object({
  username: z
    .string({ message: 'Wymagane' })
    .trim()
    .min(
      MIN_USERNAME,
      `Nazwa użytkownika musi składać się z co najmniej ${MIN_USERNAME} znaków`,
    ),
  password: z
    .string({ message: 'Wymagane' })
    .trim()
    .min(
      MIN_PASSWORD,
      `Hasło musi składać się z co najmniej ${MIN_PASSWORD} znaków`,
    ),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  username: undefined,
  password: undefined,
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isSubmitting.value = true
  try {
    const { success, error } = await authStore.login({
      username: event.data.username,
      password: event.data.password,
    })

    if (success) {
      toast.add({
        title: 'Logowanie zakończone sukcesem',
        color: 'success',
        icon: 'i-mdi-check-circle',
      })
      await router.push('/')
    } else if (error) {
      toast.add({
        title: 'Logowanie zakończone niepowodzeniem',
        description: error,
        color: 'error',
        icon: 'i-mdi-exclamation-thick',
      })
    }
  } catch (error) {
    toast.add({
      title: 'Błąd logowania',
      description: 'Wystąpił nieoczekiwany błąd',
      color: 'error',
      icon: 'i-mdi-exclamation-thick',
    })
    console.error(error)
  } finally {
    isSubmitting.value = false
  }
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
      v-model="state.username"
      icon="i-mdi-account"
      placeholder="Wpisz nazwę użytkownika"
      variant="subtle"
      label="Nazwa użytkownika"
      name="username"
    />

    <AtomsInputPassword
      v-model="state.password"
      icon="i-mdi-password"
      placeholder="Wpisz hasło"
      variant="subtle"
      label="Hasło"
      name="password"
    />

    <AtomsButton
      icon="i-mdi-account-arrow-right"
      label="Zaloguj się"
      size="lg"
      variant="solid"
      type="submit"
      :loading="isSubmitting"
      :disabled="isSubmitting"
    />
  </UForm>
</template>
