<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const auth = useAuthStore()

const homePage = {
  label: 'Strona Główna',
  icon: 'i-mdi-home',
  to: '/',
}

const adminPage = {
  label: 'admin',
  icon: 'i-mdi-shield',
  to: '/admin',
}

const searchEvents = {
  label: 'Wydarzenia',
  icon: 'i-mdi-magnify',
  children: [
    {
      label: 'Wyszukaj po nazwie',
      icon: 'i-mdi-text-box-search',
      to: '/events/find',
    },
    {
      label: 'Wyszukaj po dacie',
      icon: 'i-mdi-calendar-filter',
      to: '/events/find/by-date',
    },
    {
      label: 'Wyszukaj po tygodniu',
      icon: 'i-mdi-calendar-week',
      to: '/events/find/by-week',
    },
    {
      label: 'Wszystkie',
      icon: 'i-mdi-calendar',
      to: '/events',
    },
    {
      label: 'Dziś',
      icon: 'i-mdi-calendar-star',
      to: '/events/today',
    },
    {
      label: 'Eksportuj do pdf',
      icon: 'i-mdi-file-pdf',
      to: '/events/pdf',
    },
  ],
}

const createEvent = {
  label: 'Stwórz',
  icon: 'i-mdi-plus-circle',
  to: '/events/new',
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
  to: '/messages',
}

const profile = {
  icon: 'i-mdi-account',
  label: 'Profil',
  to: '/profile',
}

const baseItems = [homePage, searchEvents]
const loggedItems = [createEvent, chat, profile]
const unLoggedItems = [account]

const userItems = [...baseItems, ...loggedItems]

const items = computed<NavigationMenuItem[]>(() => {
  return auth.user?.isAdmin
    ? [...userItems, adminPage]
    : auth.isLoggedIn
      ? [...userItems]
      : [...baseItems, ...unLoggedItems]
})
</script>

<template>
  <UNavigationMenu :items="items" highlight />
</template>
