<script setup lang="ts">
const authStore = useAuthStore()
authStore.logout()
const toast = useToast()
toast.add({
  title: 'Poprawnie wylogowano',
  color: 'success',
  icon: 'i-mdi-check-circle',
})
const router = useRouter()
await router.push('/login')
</script>

<template>
  <AtomsParagraph>Następuje wylogowanie użytkownika.</AtomsParagraph>
</template>
