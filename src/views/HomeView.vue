<script setup lang="ts">
import EpicCard from '@/components/EpicCard.vue'
import { useEpicStore } from '@/stores/epics'
import { storeToRefs } from 'pinia'

// Use the epic store directly
const epicStore = useEpicStore()
const { epics, loading, error } = storeToRefs(epicStore)
</script>

<template>
  <v-container width="100%">
    <div class="fill-height pa-4" style="width: 100%">
    <!-- Epics Display Section -->
    <v-row v-if="epics.length > 0">
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-3">mdi-clipboard-list</v-icon>
            <span>Epics ({{ epics.length }})</span>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col
                v-for="epic in epics"
                :key="epic.id"
                cols="12"
                lg="6"
                xl="4"
              >
                <EpicCard :epic="epic" />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Loading State -->
    <v-row v-if="loading">
      <v-col cols="12" class="text-center py-12">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
        />
        <p class="text-h6 mt-4">Loading epics...</p>
      </v-col>
    </v-row>

    <!-- Empty State -->
    <v-row v-if="!loading && epics.length === 0 && error">
      <v-col cols="12" class="text-center py-12">
        <v-icon size="64" color="grey-lighten-2">mdi-clipboard-outline</v-icon>
        <p class="text-h6 mt-4">No epics found</p>
        <p class="text-body-1">Please check your Epic IDs and try again.</p>
      </v-col>
    </v-row>

    <!-- Instructions when no input -->
    <v-row v-if="!loading && epics.length === 0 && !error">
      <v-col cols="12" class="text-center py-12">
        <v-icon size="64" color="primary">mdi-information-outline</v-icon>
        <p class="text-h6 mt-4">Welcome to Epic Tracker</p>
        <p class="text-body-1">Enter Epic IDs in the sidebar to get started</p>
      </v-col>
    </v-row>
  </div>
  </v-container>
</template>

