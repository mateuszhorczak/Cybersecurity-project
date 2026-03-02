<script setup lang="ts">
const auth = useAuthStore()
</script>

<template>
  <UHeader
    mode="drawer"
    :toggle="{
      color: 'primary',
      variant: 'subtle',
      class: 'rounded-full',
    }"
  >
    <template #title>
      <div />
      <!--      <AtomsLogo class="h-6 w-auto" /> -->
    </template>

    <AtomsNavigation />

    <template #right>
      <LazyAtomsButtonLogout v-if="auth.isLoggedIn" />
      <UColorModeSwitch />
    </template>

    <template #body>
      <AtomsNavigation
        orientation="vertical"
        class="-mx-2.5"
      />
    </template>
  </UHeader>
</template>
