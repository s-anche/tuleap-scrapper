import { markRaw } from 'vue'
import type { Router } from 'vue-router'

export default defineNuxtPlugin(({ $pinia, $router }) => {
  // Enable Pinia DevTools in development
  if (process.dev) {
    $pinia.use(({ store }) => {
      // Add router to stores for DevTools
      store.router = markRaw($router as Router)
    })
  }

  // Force stores to be initialized for DevTools
  if (process.dev && process.client) {
    // Import and initialize stores to ensure DevTools can detect them
    nextTick(async () => {
      const { useAuthStore } = await import('@/stores/auth')
      const { useEpicStore } = await import('@/stores/epics')
      
      // Initialize stores
      useAuthStore()
      useEpicStore()
    })
  }
})