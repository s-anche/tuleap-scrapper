<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
// Initialize Pinia stores on app start
import { useAuthStore } from '@/stores/auth'
import { useEpicStore } from '@/stores/epics'

// Initialize auth store to check for existing token
const authStore = useAuthStore()
const epicStore = useEpicStore()

// Check for existing auth token on app start
onMounted(() => {
  authStore.checkAuth()
  // Ensure epic store is properly hydrated
  epicStore.hydrate()
})
</script>