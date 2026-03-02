<script setup lang="ts">
import type { BaseEvent } from '#shared/types/event' // import prevent Unresolvable type reference or unsupported built-in utility type bug

const props = defineProps<BaseEvent>()
</script>

<template>
  <UCard class="m-2 p-2 bg-gray-50 hover:bg-gray-50/10 dark:bg-neutral-800 dark:hover:bg-gray-50/10 transition duration-300 ease-in-out hover:scale-105">
    <AtomsSubHeading>
      {{ props.name }}
    </AtomsSubHeading>
    <AtomsParagraph>
      typ: {{ props.type }}
    </AtomsParagraph>
    <AtomsParagraph>
      {{ props.date }}
    </AtomsParagraph>
    <AtomsParagraph>
      opis: {{ props.description }}
    </AtomsParagraph>
  </UCard>
</template>
