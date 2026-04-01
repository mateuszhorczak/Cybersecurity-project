<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

interface FragmentChallenge {
  username: string
  challengeId: number
  startPosition: number
  length: number
  message: string
}

type Mode = 'password' | 'fragment-username' | 'fragment-pin'

const mode = ref<Mode>('password')
const challenge = ref<FragmentChallenge | null>(null)

function switchToFragment() {
  mode.value = 'fragment-username'
  challenge.value = null
}

function switchToPassword() {
  mode.value = 'password'
  challenge.value = null
}

function onChallenged(payload: FragmentChallenge) {
  challenge.value = payload
  mode.value = 'fragment-pin'
}

function onBack() {
  mode.value = 'fragment-username'
  challenge.value = null
}

const subHeadingText = computed(() =>
  mode.value === 'password'
    ? 'Logowanie'
    : mode.value === 'fragment-username'
      ? 'Logowanie fragmentem — krok 1'
      : 'Logowanie fragmentem — krok 2',
)
</script>

<template>
  <UCard>
    <div class="space-y-4">
      <AtomsSubHeading class="mx-auto">
        {{ subHeadingText }}
      </AtomsSubHeading>

      <USeparator />

      <MoleculesFormLogin v-if="mode === 'password'" />

      <MoleculesFormLoginFragmentChallange v-else-if="mode === 'fragment-username'" @challenged="onChallenged" />

      <MoleculesFormLoginFragmentForm v-else-if="mode === 'fragment-pin' && challenge" v-bind="challenge"
        @back="onBack" />

      <USeparator />
      <div class="flex">
        <div class="mx-auto">
          <AtomsButton v-if="mode === 'password'" icon="i-mdi-shield-key-outline" variant="link"
            label="Użyj fragmentu hasła" @click="switchToFragment" />
          <AtomsButton v-else icon="i-mdi-lock-outline" variant="link" label="Użyj pełnego hasła"
            @click="switchToPassword" />
        </div>
      </div>
    </div>
  </UCard>
</template>
