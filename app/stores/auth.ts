export const useAuthStore = defineStore('auth', () => {
  const user = useCookie<User | null>('auth:user', {
    default: () => null,
    watch: true,
  })
  const token = useCookie<string | null>('auth:token', {
    default: () => null,
    watch: true,
  })

  const login = async (userAuth: UserAuthentication) => {
    try {
      const data = await $fetch<{ token: string; user: User }>(
        '/api/auth/login',
        {
          method: 'POST',
          body: userAuth,
        },
      )

      token.value = data.token
      user.value = data.user

      return { success: true, data }
    } catch (error) {
      return {
        success: false,
        // @ts-expect-error type error silence
        error: error.data?.statusMessage || error.message,
      }
    }
  }

  const register = async (user: NewUser) => {
    try {
      const response = await $fetch('/api/auth/register', {
        method: 'POST',
        body: user,
      })

      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      return {
        success: false,
        // @ts-expect-error type error silence
        error: error.data?.statusMessage || error.message,
      }
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
  }

  const isLoggedIn = computed(() => Boolean(token.value))

  return {
    login,
    logout,
    register,
    isLoggedIn,
    user: computed(() => {
      if (!token.value) return null
      return user.value
    }),
    token: readonly(token),
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
