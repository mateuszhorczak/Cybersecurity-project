<script setup lang="ts">
import { pl } from '@nuxt/ui/locale'
import { PiniaColadaDevtools } from '@pinia/colada-devtools'
</script>

<template>
  <UApp :locale="pl">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
  <PiniaColadaDevtools  />
</template>
