// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxt/image',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@pinia/colada-nuxt',
  ],

  ssr: true,
  devtools: { enabled: true },

  app: {
    head: {
      title: 'Bialystok information service',
    },
  },

  css: ['~/assets/css/main.css'],

  colorMode: {
    preference: 'light',
  },

  runtimeConfig: {
    jwtSecret: '',
  },

  experimental: {
    cookieStore: true,
  },

  compatibilityDate: '2024-11-01',
  nitro: {
    experimental: {
      openAPI: true,
    },
  },

  eslint: {
    config: {
      stylistic: true,
    },
  },
})