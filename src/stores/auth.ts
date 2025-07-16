import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('tuleap_token'))
  const user = ref<any>(null)
  const loading = ref(false)

  const isAuthenticated = computed(() => !!token.value)

  const setToken = (newToken: string) => {
    token.value = newToken
    localStorage.setItem('tuleap_token', newToken)
  }

  const clearToken = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('tuleap_token')
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
  }

  return {
    token: computed(() => token.value),
    user: computed(() => user.value),
    loading: computed(() => loading.value),
    isAuthenticated,
    setToken,
    clearToken,
    validateToken,
    logout
  }
})