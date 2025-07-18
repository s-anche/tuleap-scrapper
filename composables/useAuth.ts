import { ref, computed } from 'vue'

const TOKEN_KEY = 'tuleap_token'

export function useAuth() {
  const token = ref<string | null>(process.client ? localStorage.getItem(TOKEN_KEY) : null)

  const isAuthenticated = computed(() => !!token.value)

  const setToken = (newToken: string) => {
    token.value = newToken
    if (process.client) {
      localStorage.setItem(TOKEN_KEY, newToken)
    }
  }

  const clearToken = () => {
    token.value = null
    if (process.client) {
      localStorage.removeItem(TOKEN_KEY)
      navigateTo('/login')
    }
  }

  const requireAuth = () => {
    if (!isAuthenticated.value) {
      if (process.client) {
        navigateTo('/login')
      }
      return false
    }
    return true
  }

  return {
    token: computed(() => token.value),
    isAuthenticated,
    setToken,
    clearToken,
    requireAuth
  }
}