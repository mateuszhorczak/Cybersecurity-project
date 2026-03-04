<script setup lang="ts">
import type { ModalProps } from '@nuxt/ui'

interface Props {
  title?: ModalProps['title']
  isFooter?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  isFooter: false,
})
const isOpen = defineModel<boolean>()
</script>

<template>
  <UModal
    v-model:open="isOpen"
    :title="props.title"
    close-icon="i-mdi-close"
    :close="{
      color: 'primary',
      variant: 'outline',
      class: 'rounded-full cursor-pointer',
    }"
  >
    <template #default>
      <slot />
    </template>

    <template #body>
      <slot name="body" />
    </template>

    <template
      v-if="props.isFooter"
      #footer
    >
      <slot name="footer" />
    </template>
  </UModal>
</template>
