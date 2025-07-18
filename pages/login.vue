<template>
  <div class="fill-height">
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
      <v-col cols="12" class="text-center mb-8">
        <div class="login-header">
          <v-icon size="64" color="primary" class="mb-4">mdi-chart-line</v-icon>
          <h1 class="text-h3 text-primary font-weight-light mb-2">Tuleap Tracker</h1>
          <p class="text-h6 text-medium-emphasis">Enter your API token to access the dashboard</p>
        </div>
      </v-col>
      </v-row>
      <TokenInput />
    </v-container>
  </div>
</template>

<script setup lang="ts">
import TokenInput from '@/components/TokenInput.vue'

// Set page meta - no auth required for login page
definePageMeta({
  middleware: 'guest',
  layout: 'auth'
})
</script>