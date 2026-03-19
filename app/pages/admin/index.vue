<script lang="ts" setup>
import type { FormSubmitEvent } from '@nuxt/ui'
import { z } from 'zod'

definePageMeta({
  middleware: ['auth', 'admin'],
})

const restrictionStore = useRestrictionStore()
const MAX_ATTEMPTS = 20
const MAX_TIMEOUT = 36000 // in seconds, 10 minutes
const numberError = 'Wymagana liczba całkowita'
const minAttemptError = 'Minimum jedna próba'
const maxAttemptError = `Maksimum ${MAX_ATTEMPTS} prób`
const nonNegativeError = 'Czas nie może być ujemny'
const maxTimeoutError = `Maksimum ${MAX_TIMEOUT} sekund`

const warningAttemptsSchema = z.object({
  value: z
    .number({ error: numberError })
    .int()
    .positive(minAttemptError)
    .max(MAX_ATTEMPTS, maxAttemptError),
})
type WarningAttemptsSchema = z.output<typeof warningAttemptsSchema>
const warningAttemptsState = reactive<Partial<WarningAttemptsSchema>>({
  value:
    restrictionStore.restrictions && restrictionStore.restrictions.length > 0
      ? restrictionStore.restrictions[Restrictions.WarningAttempts - 1]?.value
      : undefined,
})

async function onWarningAttemptsSubmit(
  event: FormSubmitEvent<WarningAttemptsSchema>,
) {
  await restrictionStore.updateRestriction({
    id: Restrictions.WarningAttempts,
    value: event.data.value,
  })
}

const lockAttemptsSchema = z.object({
  value: z
    .number({ error: numberError })
    .int()
    .positive(minAttemptError)
    .max(MAX_ATTEMPTS, maxAttemptError),
})
type LockAttemptsSchema = z.output<typeof lockAttemptsSchema>
const lockAttemptsState = reactive<Partial<LockAttemptsSchema>>({
  value:
    restrictionStore.restrictions && restrictionStore.restrictions.length > 0
      ? restrictionStore.restrictions[Restrictions.LockAttempts - 1]?.value
      : undefined,
})

async function onLockAttemptsSubmit(
  event: FormSubmitEvent<LockAttemptsSchema>,
) {
  await restrictionStore.updateRestriction({
    id: Restrictions.LockAttempts,
    value: event.data.value,
  })
}

const warningTimeoutSchema = z.object({
  value: z
    .number({ error: numberError })
    .int()
    .min(0, nonNegativeError)
    .max(MAX_TIMEOUT, maxTimeoutError),
})
type WarningTimeoutSchema = z.output<typeof warningTimeoutSchema>
const warningTimeoutState = reactive<Partial<WarningTimeoutSchema>>({
  value:
    restrictionStore.restrictions && restrictionStore.restrictions.length > 0
      ? restrictionStore.restrictions[Restrictions.WarningTimeout - 1]?.value
      : undefined,
})

async function onWarningTimeoutSubmit(
  event: FormSubmitEvent<WarningTimeoutSchema>,
) {
  await restrictionStore.updateRestriction({
    id: Restrictions.WarningTimeout,
    value: event.data.value,
  })
}

// avoid hydration mismatch with client only and watch
watch(
  () => restrictionStore.restrictions,
  (restrictions) => {
    warningAttemptsState.value =
      restrictions && restrictions.length > 0
        ? restrictions[Restrictions.WarningAttempts - 1]?.value
        : undefined

    lockAttemptsState.value =
      restrictions && restrictions.length > 0
        ? restrictions[Restrictions.LockAttempts - 1]?.value
        : undefined

    warningTimeoutState.value =
      restrictions && restrictions.length > 0
        ? restrictions[Restrictions.WarningTimeout - 1]?.value
        : undefined
  },
  { immediate: true },
)
</script>

<template>
<UContainer class="py-10 max-w-2xl">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-highlighted">
        Ustawienia bezpieczeństwa logowania
      </h1>
      <p class="text-muted mt-1">
        Każde ustawienie zapisywane jest niezależnie.
      </p>
    </div>

    <div class="flex flex-col gap-4">

      <UCard>
        <template #header>
          <div class="flex items-center gap-3">
            <div class="p-2 bg-warning/10 rounded-lg">
              <UIcon name="i-lucide-triangle-alert" class="size-5 text-warning" />
            </div>
            <div>
              <p class="font-semibold text-highlighted">Liczba prób do ostrzeżenia</p>
              <p class="text-sm text-muted">Po ilu nieudanych próbach użytkownik zobaczy ostrzeżenie.</p>
            </div>
          </div>
        </template>

        <ClientOnly>
          <UForm
            :schema="warningAttemptsSchema"
            :state="warningAttemptsState"
            class="flex items-end gap-3"
            @submit="onWarningAttemptsSubmit"
          >
            <UFormField name="value" label="Liczba prób" required class="flex-1">
              <UInputNumber
                v-model="warningAttemptsState.value"
                :min="1"
                :max="MAX_ATTEMPTS"
                placeholder="np. 3"
                class="w-full"
              />
            </UFormField>
            <UButton type="submit" icon="i-lucide-save" class="mb-0.5">
              Zapisz
            </UButton>
          </UForm>
        </ClientOnly>
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center gap-3">
            <div class="p-2 bg-error/10 rounded-lg">
              <UIcon name="i-lucide-lock" class="size-5 text-error" />
            </div>
            <div>
              <p class="font-semibold text-highlighted">Liczba prób do blokady</p>
              <p class="text-sm text-muted">Po ilu nieudanych próbach konto zostanie zablokowane.</p>
            </div>
          </div>
        </template>

        <ClientOnly>
          <UForm
            :schema="lockAttemptsSchema"
            :state="lockAttemptsState"
            class="flex items-end gap-3"
            @submit="onLockAttemptsSubmit"
          >
            <UFormField name="value" label="Liczba prób" required class="flex-1">
              <UInputNumber
                v-model="lockAttemptsState.value"
                :min="1"
                :max="MAX_ATTEMPTS"
                placeholder="np. 5"
                class="w-full"
              />
            </UFormField>
            <UButton type="submit" icon="i-lucide-save" class="mb-0.5">
              Zapisz
            </UButton>
          </UForm>
        </ClientOnly>
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center gap-3">
            <div class="p-2 bg-warning/10 rounded-lg">
              <UIcon name="i-lucide-clock-alert" class="size-5 text-warning" />
            </div>
            <div>
              <p class="font-semibold text-highlighted">Czas ostrzeżenia</p>
              <p class="text-sm text-muted">Jak długo (w sekundach) utrzymuje się stan ostrzeżenia.</p>
            </div>
          </div>
        </template>

        <ClientOnly>
           <UForm
            :schema="warningTimeoutSchema"
            :state="warningTimeoutState"
            class="flex items-end gap-3"
            @submit="onWarningTimeoutSubmit"
          >
            <UFormField name="value" label="Czas (sekundy)" required class="flex-1">
              <UInputNumber
                v-model="warningTimeoutState.value"
                :min="1"
                :max="MAX_TIMEOUT"
                placeholder="np. 1"
                class="w-full"
              />
            </UFormField>
            <UButton type="submit" icon="i-lucide-save" class="mb-0.5">
              Zapisz
            </UButton>
          </UForm>
        </ClientOnly>
     </UCard>
    </div>
  </UContainer>
</template>