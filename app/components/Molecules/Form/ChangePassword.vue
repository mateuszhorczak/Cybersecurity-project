<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'
import { userPasswordSelectSchema } from '~~/server/db/schema'

const auth = useAuthStore()

const schema = userPasswordSelectSchema
  .extend({
    repeatPassword: z
      .string({ error: 'Wymagane' })
      .trim()
      .min(1, { error: 'Wymagane' }),
    oldPassword: z
      .string({ error: 'Wymagane' })
      .trim()
      .min(1, { error: 'Wymagane' }),
  })
  .refine((data) => data.password === data.repeatPassword, {
    error: 'Hasła różnią się',
    path: ['repeatPassword'],
  })

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  oldPassword: undefined,
  password: undefined,
  repeatPassword: undefined,
})

const validate: (state: Partial<Schema>) => FormError[] = (state) => {
  const { error } = schema.safeParse(state)
  return handleValidationError(error)
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  if (!auth.user) return
  const promise = auth.changePassword({
    id: auth.user.id,
    oldPassword: event.data.oldPassword,
    password: event.data.password,
  })
  if (!(await promise)) return
  await useRouter().push('/logout')
}
</script>

<template>
  <UCard>
    <UForm :state="state" :validate="validate" class="space-y-4" @submit="onSubmit">
      <AtomsInputPassword v-model="state.oldPassword" label="Hasło" name="oldPassword" icon="i-lucide-lock-keyhole"
        placeholder="Wpisz obecne hasło" variant="outline" />

      <AtomsInputPasswordValidation v-model="state.password" label="Nowe hasło" name="password"
        icon="i-lucide-lock-keyhole" placeholder="Wpisz nowe hasło" variant="outline" />

      <AtomsInputPassword v-model="state.repeatPassword" label="Powtórz hasło" name="repeatPassword"
        icon="i-lucide-lock-keyhole" placeholder="Wpisz hasło jeszcze raz" variant="outline" />
      <AtomsButton icon="i-lucide-user-pen" label="Zmień hasło" variant="solid" size="lg" type="submit"
        :loading="auth.isLoading" :disabled="auth.isLoading" />
    </UForm>
  </UCard>
</template>