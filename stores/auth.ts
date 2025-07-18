import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const user = ref<any>(null)
  const loading = ref(false)

  const isAuthenticated = computed(() => !!token.value)

  const setToken = (newToken: string) => {
    token.value = newToken
    if (process.client) {
      localStorage.setItem('tuleap_token', newToken)
    }
  }

  const clearToken = () => {
    token.value = null
    user.value = null
    if (process.client) {
      localStorage.removeItem('tuleap_token')
    }
  }

  const checkAuth = () => {
    if (process.client) {
      const storedToken = localStorage.getItem('tuleap_token')
      if (storedToken) {
        token.value = storedToken
      }
    }
  }

  const validateToken = async () => {
    if (!token.value) return false

    loading.value = true
    try {
      // Mock validation - any non-empty token is valid
      await new Promise(resolve => setTimeout(resolve, 200))
      return token.value.trim().length > 0
    } catch (error) {
      clearToken()
      return false
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    clearToken()
    if (process.client) {
      navigateTo('/login')
    }
  }

  return {
    token: computed(() => token.value),
    user: computed(() => user.value),
    loading: computed(() => loading.value),
    isAuthenticated,
    setToken,
    clearToken,
    checkAuth,
    validateToken,
    logout
  }
})