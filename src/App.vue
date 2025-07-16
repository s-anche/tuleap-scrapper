<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from './stores/auth'
import { useTheme } from 'vuetify'

const theme = useTheme()
const route = useRoute()
const authStore = useAuthStore()

const drawer = ref(true)
const rail = ref(false)

const isAuthenticated = computed(() => authStore.isAuthenticated)
const showLayout = computed(() => {
  return route.name !== 'login' && isAuthenticated.value
})

const maskedToken = computed(() => {
  const token = authStore.token
  if (!token) return ''
  return token.length > 8 ? `${token.slice(0, 4)}...${token.slice(-4)}` : token
})

const navigationItems = [
  {
    title: 'Dashboard',
    icon: 'mdi-view-dashboard',
    to: '/',
    active: true
  },
  {
    title: 'Projects',
    icon: 'mdi-folder-multiple',
    to: '/projects'
  },
  {
    title: 'Artifacts',
    icon: 'mdi-format-list-bulleted',
    to: '/artifacts'
  },
  {
    title: 'Reports',
    icon: 'mdi-chart-line',
    to: '/reports'
  }
]

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}

const handleLogout = () => {
  authStore.logout()
}

onMounted(() => {
  console.log('App mounted')
  console.log('Current route:', route.name)
  console.log('Is authenticated:', authStore.isAuthenticated)
})
</script>

<template>
  <v-app>
    <!-- Login Layout -->
    <template v-if="!showLayout">
      <v-main>
        <RouterView />
      </v-main>
    </template>

    <!-- Main Application Layout -->
    <template v-else>
      <!-- Navigation Drawer -->
      <v-navigation-drawer
        v-model="drawer"
        :rail="rail"
        permanent
        @click="rail = false"
      >
        <v-list-item
          prepend-icon="mdi-chart-line"
          :title="rail ? '' : 'Tuleap Tracker'"
          nav
        >
          <template v-slot:append>
            <v-btn
              variant="text"
              icon="mdi-chevron-left"
              @click.stop="rail = !rail"
            ></v-btn>
          </template>
        </v-list-item>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <v-list-item
            v-for="item in navigationItems"
            :key="item.title"
            :prepend-icon="item.icon"
            :title="item.title"
            :to="item.to"
            :active="route.path === item.to"
            color="primary"
          ></v-list-item>
        </v-list>

        <template v-slot:append>
          <v-divider></v-divider>
          <v-list density="compact" nav>
            <v-list-item
              prepend-icon="mdi-theme-light-dark"
              title="Toggle Theme"
              @click="toggleTheme"
            ></v-list-item>
            <v-list-item
              prepend-icon="mdi-cog"
              title="Settings"
              to="/settings"
            ></v-list-item>
            <v-list-item
              prepend-icon="mdi-logout"
              title="Logout"
              @click="handleLogout"
            ></v-list-item>
          </v-list>
        </template>
      </v-navigation-drawer>

      <!-- App Bar -->
      <v-app-bar color="primary" density="compact">
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        
        <v-toolbar-title>
          {{ route.meta.title || 'Tuleap Tracker' }}
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <!-- Breadcrumbs -->
        <v-breadcrumbs
          v-if="route.meta.breadcrumbs"
          :items="route.meta.breadcrumbs as any"
          class="pa-0"
        >
          <template v-slot:prepend>
            <v-icon size="small">mdi-home</v-icon>
          </template>
          <template v-slot:divider>
            <v-icon size="small">mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs>

        <v-spacer></v-spacer>

        <!-- User Menu -->
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              variant="text"
              append-icon="mdi-chevron-down"
            >
              <v-icon start>mdi-account</v-icon>
              <span class="d-none d-sm-inline">{{ maskedToken }}</span>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              prepend-icon="mdi-account-circle"
              title="Profile"
              subtitle="View profile"
            ></v-list-item>
            <v-list-item
              prepend-icon="mdi-cog"
              title="Settings"
              subtitle="App settings"
            ></v-list-item>
            <v-divider></v-divider>
            <v-list-item
              prepend-icon="mdi-logout"
              title="Logout"
              @click="handleLogout"
            ></v-list-item>
          </v-list>
        </v-menu>
      </v-app-bar>

      <!-- Main Content -->
      <v-main>
        <v-container fluid class="pa-6" style="max-width: none;">
          <RouterView />
        </v-container>
      </v-main>
    </template>
  </v-app>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.v-navigation-drawer {
  border-right: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)) !important;
}

.v-app-bar {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)) !important;
}
</style>
