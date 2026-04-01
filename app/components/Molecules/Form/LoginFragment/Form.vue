<script setup lang="ts">
const props = defineProps<{
  username: string
  challengeId: number
  startPosition: number
  length: number
  message: string
}>()

const emit = defineEmits<{
  back: []
}>()

const authStore = useAuthStore()
const toast = useToast()
const router = useRouter()
const isSubmitting = ref(false)

const fragmentChars = ref<string[]>(new Array(props.length).fill(''))

const isComplete = computed(() => fragmentChars.value.every((c) => c !== ''))

async function onSubmit() {
  if (!isComplete.value) return

  isSubmitting.value = true
  const fragment = fragmentChars.value.join('')

  try {
    const { success, error } = await authStore.loginFragment({
      username: props.username,
      challengeId: props.challengeId,
      fragment,
    })

    if (success) {
      toast.add({
        title: 'Logowanie zakończone sukcesem',
        color: 'success',
        icon: 'i-mdi-check-circle',
      })
      await router.push('/')
    } else {
      toast.add({
        title: 'Logowanie zakończone niepowodzeniem',
        description: error,
        color: 'error',
        icon: 'i-mdi-exclamation-thick',
      })
    }
  } catch {
    toast.add({
      title: 'Błąd logowania',
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
  <div class="space-y-4">
    <UAlert icon="i-mdi-information" color="info" variant="subtle" :title="message"
      :description="`Użytkownik: ${username} · Pozycje ${startPosition + 1}–${startPosition + length}`" />

    <UFormField label="Fragment hasła" name="fragment">
      <UPinInput v-model="fragmentChars" :length="length" mask placeholder="○" variant="subtle" size="lg" autofocus />
    </UFormField>

    <div class="flex gap-2">
      <AtomsButton icon="i-mdi-arrow-left" label="Wróć" size="lg" variant="ghost" :disabled="isSubmitting"
        @click="emit('back')" />
      <AtomsButton icon="i-mdi-account-arrow-right" label="Zaloguj się" size="lg" variant="solid"
        :loading="isSubmitting" :disabled="isSubmitting || !isComplete" @click="onSubmit" />
    </div>
  </div>
</template>
