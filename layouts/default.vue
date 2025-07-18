<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useEpicStore } from '@/stores/epics'

const route = useRoute()
const authStore = useAuthStore()
const epicStore = useEpicStore()

// Hydrate the store on client mount
onMounted(() => {
  epicStore.hydrate()
})

// const isAuthenticated = computed(() => authStore.isAuthenticated)

const navigationItems = [
  {
    title: 'Epic Board',
    icon: 'mdi-view-column',
    to: '/',
  },
  {
    title: 'Stories & Tasks',
    icon: 'mdi-table',
    to: '/stories-table',
  },
]

const handleLogout = () => {
  authStore.logout()
}
</script>

<template>
  <v-app>
    <!-- Navigation Drawer -->
    <ClientOnly>
      <v-navigation-drawer permanent>
      <v-list-item prepend-icon="mdi-clipboard-list" title="Epic Tracker" nav />

      <v-divider />

      <!-- Epic Input Section -->
      <div class="pa-4">
        <ClientOnly>
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
          <template #fallback>
            <v-text-field
              model-value=""
              label="Epic IDs"
              placeholder="416725, 123456"
              variant="outlined"
              density="compact"
              hide-details="auto"
              clearable
              class="mb-3"
              disabled
            />
          </template>
        </ClientOnly>

        <div class="d-flex gap-2">
          <v-btn
            @click="epicStore.loadEpics"
            :disabled="!epicStore.isValidInput || epicStore.loading"
            :loading="epicStore.loading"
            color="primary"
            variant="elevated"
            size="small"
            class="flex-grow-1"
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
            min-width="44"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
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
    </ClientOnly>

    <!-- App Bar -->
    <v-app-bar>
      <v-app-bar-title>Epic Tracker</v-app-bar-title>
    </v-app-bar>

    <!-- Main Content -->
    <v-main class="bg-grey-lighten-4">
      <slot />
    </v-main>
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