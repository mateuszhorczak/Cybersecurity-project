<script setup lang="ts">
const logout = async () => {
  await useRouter().push('logout')
}
</script>

<template>
  <UButton
    icon="i-mdi-exit-to-app"
    variant="ghost"
    class="cursor-pointer"
    @click="logout"
  />
</template>
