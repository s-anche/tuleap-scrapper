<script setup lang="ts">
import { computed } from 'vue'
import EpicCard from './EpicCard.vue'
import type { Epic } from '@/types/api'

interface Props {
  title: string
  status: string
  epics: Epic[]
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary'
})

const statusIcon = computed(() => {
  switch (props.status.toLowerCase()) {
    case 'to do':
      return 'mdi-clipboard-text-outline'
    case 'development in progress':
      return 'mdi-progress-wrench'
    case 'done':
      return 'mdi-check-circle'
    case 'cancelled':
      return 'mdi-cancel'
    default:
      return 'mdi-clipboard-list'
  }
})

const statusColor = computed(() => {
  switch (props.status.toLowerCase()) {
    case 'to do':
      return 'info'
    case 'development in progress':
      return 'warning'
    case 'done':
      return 'success'
    case 'cancelled':
      return 'error'
    default:
      return 'primary'
  }
})
</script>

<template>
  <div class="kanban-column">
    <v-card 
      class="h-100 d-flex flex-column"
      variant="outlined"
      :color="statusColor"
    >
      <!-- Column Header -->
      <v-card-title class="d-flex align-center pa-4 pb-2">
        <v-icon :color="statusColor" class="mr-2">{{ statusIcon }}</v-icon>
        <span class="text-h6">{{ title }}</span>
        <v-spacer />
        <v-chip
          :color="statusColor"
          variant="tonal"
          size="small"
          class="text-caption"
        >
          {{ epics.length }}
        </v-chip>
      </v-card-title>

      <v-divider />

      <!-- Column Content -->
      <v-card-text class="flex-grow-1 pa-2" style="max-height: calc(100vh - 200px); overflow-y: auto;">
        <div class="d-flex flex-column ga-2">
          <div
            v-for="epic in epics"
            :key="epic.id"
            class="kanban-card"
          >
            <EpicCard :epic="epic" />
          </div>
        </div>
        
        <!-- Empty State -->
        <div
          v-if="epics.length === 0"
          class="text-center py-8"
        >
          <v-icon
            :color="statusColor"
            size="48"
            class="mb-2"
          >
            {{ statusIcon }}
          </v-icon>
          <p class="text-body-2 text-medium-emphasis">
            No epics in {{ title.toLowerCase() }}
          </p>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped>
.kanban-column {
  min-width: 350px;
  max-width: 400px;
  height: 100%;
}

.kanban-card {
  transition: all 0.2s ease-in-out;
}

.kanban-card:hover {
  transform: translateY(-1px);
}

/* Custom scrollbar for column content */
.v-card-text::-webkit-scrollbar {
  width: 6px;
}

.v-card-text::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

.v-card-text::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.v-card-text::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}
</style>