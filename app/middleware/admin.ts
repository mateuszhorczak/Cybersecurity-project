export default defineNuxtRouteMiddleware(async (to, _from) => {
  const authStore = useAuthStore()

  const isAdminPage = to.path === '/admin'
  const isAdminSubpage = to.path.includes('/admin')

  const { data: isAdmin } = await useFetch<boolean>('/api/auth/is-admin', {
    method: 'GET',
    query: { token: authStore.token },
    // @ts-expect-error transform type silence
    transform: ({ data }) => data,
  })

  if (!isAdmin.value && (isAdminPage || isAdminSubpage)) {
    return navigateTo('/')
  }
})
