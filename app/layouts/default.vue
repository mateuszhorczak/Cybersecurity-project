<script setup lang="ts">
</script>

<template>
  <OrganismsNavbar />
  <UMain>
    <UPage>
      <template #left>
        <div />
      </template>
      <template #default>
        <UPageBody>
          <NuxtPage />
        </UPageBody>
      </template>
      <template #right>
        <div />
      </template>
    </UPage>
  </UMain>
  <OrganismsFooter />
</template>
