<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { computed, ref } from 'vue'
import { useAuthStore } from './stores/auth'
import { useEpicStore } from './stores/epics'

const route = useRoute()
const authStore = useAuthStore()
const epicStore = useEpicStore()

const drawer = ref(false)

const isAuthenticated = computed(() => authStore.isAuthenticated)
const showLayout = computed(() => {
  return route.name !== 'login' && isAuthenticated.value
})

const navigationItems = [
  {
    title: 'Epic Tracker',
    icon: 'mdi-clipboard-list',
    to: '/',
  },
]

const handleLogout = () => {
  authStore.logout()
}
</script>

<template>
  <v-app>
    <v-layout class="rounded rounded-md border">
      <!-- Login Layout -->
      <template v-if="!showLayout">
        <v-main>
          <RouterView />
        </v-main>
      </template>

      <!-- Main Application Layout -->
      <template v-else>
        <!-- Navigation Drawer -->
        <v-navigation-drawer v-model="drawer">
          <v-list-item prepend-icon="mdi-clipboard-list" title="Epic Tracker" nav />

          <v-divider />

          <!-- Epic Input Section -->
          <div class="pa-4">
            <v-text-field
              :model-value="epicStore.epicIds"
              @update:model-value="epicStore.setEpicIds"
              label="Epic IDs"
              placeholder="416725, 123456"
              variant="outlined"
              density="compact"
              @keyup.enter="epicStore.loadEpics"
              :error-messages="epicStore.error"
              hide-details="auto"
              clearable
              class="mb-3"
            />

            <div class="d-flex gap-2">
              <v-btn
                @click="epicStore.loadEpics"
                :disabled="!epicStore.isValidInput || epicStore.loading"
                :loading="epicStore.loading"
                color="primary"
                variant="elevated"
                size="small"
                block
              >
                <v-icon left>mdi-magnify</v-icon>
                Load
              </v-btn>
              <v-btn
                @click="epicStore.clearEpics"
                :disabled="epicStore.loading"
                color="secondary"
                variant="outlined"
                size="small"
                icon="mdi-close"
              />
            </div>
          </div>

          <v-divider />

          <v-list density="compact" nav>
            <v-list-item
              v-for="item in navigationItems"
              :key="item.title"
              :prepend-icon="item.icon"
              :title="item.title"
              :to="item.to"
              :active="route.path === item.to"
              color="primary"
            />
          </v-list>

          <template v-slot:append>
            <v-divider />
            <v-list density="compact" nav>
              <v-list-item prepend-icon="mdi-logout" title="Logout" @click="handleLogout" />
            </v-list>
          </template>
        </v-navigation-drawer>

        <!-- App Bar -->
        <v-app-bar>
          <v-app-bar-nav-icon @click="drawer = !drawer" />
          <v-app-bar-title>Epic Tracker</v-app-bar-title>
        </v-app-bar>

        <!-- Main Content -->
        <v-main class="d-flex align-center justify-center" width="100%">
          <RouterView />
        </v-main>
      </template>
    </v-layout>
  </v-app>
</template>

<style>
/* Keep minimal global styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
