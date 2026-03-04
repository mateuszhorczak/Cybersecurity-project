// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt([
  {
    rules: {
      'vue/no-multiple-template-root': 'off',
      '@typescript-eslint/no-explicit-any': 'off', // biome check it
    },
  },
])
