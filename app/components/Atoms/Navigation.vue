<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const auth = useAuthStore()

const homePage = {
  label: 'Strona Główna',
  icon: 'i-mdi-home',
  to: '/',
}

const events = {
  label: 'Wydarzenia',
  icon: 'i-mdi-calendar',
  to: '/events',
}

const eventsToday = {
  label: 'Dziś',
  icon: 'i-mdi-calendar-star',
  to: '/events/today',
}

const searchEvents = {
  label: 'Wyszukaj wydarzenia',
  icon: 'i-mdi-magnify',
  children: [
    {
      label: 'po nazwie',
      icon: 'i-mdi-text-box-search',
      to: '/events/find',
    },
    {
      label: 'po dacie',
      icon: 'i-mdi-calendar-filter',
      to: '/events/find/by-date',
    },
    {
      label: 'po tygodniu',
      icon: 'i-mdi-calendar-week',
      to: '/events/find/by-week',
    },
  ],
}

const createEvent = {
  label: 'Stwórz',
  icon: 'i-mdi-plus-circle',
  to: '/events/new',
}

const exportPdf = {
  label: 'Eksportuj do pdf',
  icon: 'i-mdi-file-pdf',
  to: '/events/pdf',
}

const account = {
  icon: 'i-mdi-account',
  children: [
    {
      label: 'Zaloguj się',
      icon: 'i-mdi-door',
      to: '/login',
    },
    {
      label: 'Załóż konto',
      icon: 'i-mdi-door-open',
      to: '/register',
    },
  ],
}

const chat = {
  icon: 'i-mdi-chat',
  label: 'Chat',
  to: '/messages'
}

const baseItems = [homePage, events, eventsToday, searchEvents]
const loggedItems = [createEvent, exportPdf, chat]
const unLoggedItems = [account]

const items = computed<NavigationMenuItem[]>(() => {
  return auth.isLoggedIn
    ? [...baseItems, ...loggedItems]
    : [...baseItems, ...unLoggedItems]
})
</script>

<template>
  <UNavigationMenu
    :items="items"
    highlight
  />
</template>
