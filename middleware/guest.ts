export default defineNuxtRouteMiddleware(() => {
  // Check if running on client side
  if (process.client) {
    const token = localStorage.getItem('tuleap_token')
    
    if (token) {
      return navigateTo('/')
    }
  }
})