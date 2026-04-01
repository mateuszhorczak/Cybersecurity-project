import { KEYS as MESSAGE_KEYS } from '~/queries/messages'

export const useAuthStore = defineStore('auth', () => {
  const isLoading = ref<boolean>(false)
  const user = useCookie<User | null>('auth:user', {
    default: () => null,
    watch: true,
  })
  const token = useCookie<string | null>('auth:token', {
    default: () => null,
    watch: true,
  })

  const clearCache = () => {
    const cache = useQueryCache()
    cache.invalidateQueries({ key: MESSAGE_KEYS.root })
  }

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

      const cache = useQueryCache()
      await cache.invalidateQueries({ key: MESSAGE_KEYS.root })

      return { success: true, data }
    } catch (error) {
      return {
        success: false,
        // @ts-expect-error type error silence
        error: error.data?.statusMessage || error.message,
      }
    }
  }

  const loginFragment = async (payload: {
    username: string
    challengeId: number
    fragment: string
  }) => {
    try {
      const data = await $fetch<{ token: string; user: User }>(
        '/api/auth/login-fragment',
        {
          method: 'POST',
          body: payload,
        },
      )

      token.value = data.token
      user.value = data.user
      const cache = useQueryCache()
      await cache.invalidateQueries({ key: MESSAGE_KEYS.root })

      return { success: true, data }
    } catch (error) {
      return {
        success: false,
        // @ts-expect-error type error silence
        error: error.data?.statusMessage || error.message,
      }
    }
  }

  const getChallange = async (username: string) => {
    try {
      const data = await $fetch('/api/auth/challange', {
        method: 'POST',
        body: { username },
      })
      return {
        success: true,
        data,
      }
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

  const changePassword = async (payload: ChangePasswordPayload) => {
    isLoading.value = true
    const { data } = await $fetch('/api/auth/change-password', {
      method: 'PATCH',
      body: payload,
    })
      .then((data) => {
        useNuxtApp().$createSuccessToast({
          title: 'Poprawnie zmieniono hasło',
          description: 'Zaloguj się ponownie',
        })
        return { data }
      })
      .catch((error) => {
        handleApiError(error, 'Wystąpił błąd podczas tworzenia konta')
        return { data: { success: false } }
      })
      .finally(() => {
        isLoading.value = false
      })
    return data.success
  }

  const logout = () => {
    token.value = null
    user.value = null

    clearCache()
  }

  const isLoggedIn = computed(() => Boolean(token.value))

  return {
    login,
    loginFragment,
    getChallange,
    logout,
    register,
    isLoggedIn,
    user: computed(() => {
      if (!token.value) return null
      return user.value
    }),
    token: readonly(token),
    isLoading,
    changePassword,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
