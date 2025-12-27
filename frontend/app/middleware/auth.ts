/**
 * Authentication middleware that protects routes and handles redirects.
 * Redirects unauthenticated users to login page and authenticated users away from auth pages.
 */
export default defineNuxtRouteMiddleware((to) => {
  const user = useDirectusUser()

  if (!user.value) {
    if (to.path !== '/login' && to.path !== '/register') {
      return navigateTo('/login')
    }
    return
  }

  if (user.value) {
    if (to.path === '/login' || to.path === '/register') {
      return navigateTo('/')
    }
    return
  }
})