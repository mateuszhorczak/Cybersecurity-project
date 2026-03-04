export default defineNuxtRouteMiddleware(async (to, _from) => {
  const authStore = useAuthStore()

  const isLogoutPage = to.path !== '/logout'
  const isLoginPage = to.path !== '/login'
  const isRegisterPage = to.path !== '/register'

  if (authStore.token) {
    const { data: isTokenExpired } = await useFetch<boolean>(
      '/api/auth/token/expired',
      {
        method: 'GET',
        query: { token: authStore.token },
        // @ts-expect-error transform type silence
        transform: ({ data }) => data,
      },
    )

    if (isTokenExpired.value && isLogoutPage) {
      return navigateTo('/logout')
    }
  }

  if (!(authStore.isLoggedIn || isLoginPage || isRegisterPage)) {
    return navigateTo('/login')
  }

  if (
    authStore.isLoggedIn
    && (to.path === '/login' || to.path === '/register')
  ) {
    return navigateTo('/')
  }
})
