import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const TOKEN_KEY = 'tuleap_token'

export function useAuth() {
  const router = useRouter()
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))

  const isAuthenticated = computed(() => !!token.value)

  const setToken = (newToken: string) => {
    token.value = newToken
    localStorage.setItem(TOKEN_KEY, newToken)
  }

  const clearToken = () => {
    token.value = null
    localStorage.removeItem(TOKEN_KEY)
    router.push('/login')
  }

  const requireAuth = () => {
    if (!isAuthenticated.value) {
      router.push('/login')
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