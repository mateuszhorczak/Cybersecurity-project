<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '@nuxt/ui'
import type * as z from 'zod'
import { userLoginSchema } from '#server/db/schema'

const authStore = useAuthStore()
const toast = useToast()
const router = useRouter()
const isSubmitting = ref(false)

const schema = userLoginSchema

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  username: undefined,
  password: undefined,
})

const validate: (state: Partial<Schema>) => FormError[] = (state) => {
  const { error } = schema.safeParse({ ...state })
  return handleValidationError(error)
}

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
  <UForm :validate="validate" :state="state" class="space-y-4" @submit="onSubmit">
    <AtomsInput v-model="state.username" icon="i-mdi-account" placeholder="Wpisz nazwę użytkownika" variant="subtle"
      label="Nazwa użytkownika" name="username" />

    <AtomsInputPassword v-model="state.password" icon="i-mdi-password" placeholder="Wpisz hasło" variant="subtle"
      label="Hasło" name="password" />

    <AtomsButton icon="i-mdi-account-arrow-right" label="Zaloguj się" size="lg" variant="solid" type="submit"
      :loading="isSubmitting" :disabled="isSubmitting" />
  </UForm>
</template>
