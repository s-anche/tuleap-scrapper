<script setup lang="ts">
import { computed } from 'vue'
import KanbanColumn from '@/components/KanbanColumn.vue'
import { useEpicStore } from '@/stores/epics'
import { storeToRefs } from 'pinia'
import type { Epic } from '@/types/api'

// Set page meta for authentication
definePageMeta({
  middleware: 'auth',
  title: 'Dashboard'
})

// Use the epic store directly
const epicStore = useEpicStore()
const { epics, loading, error } = storeToRefs(epicStore)

// Group epics by status
const groupedEpics = computed(() => {
  const groups: { [key: string]: Epic[] } = {}
  
  epics.value.forEach(epic => {
    const status = epic.status || 'No Status'
    
    if (!groups[status]) {
      groups[status] = []
    }
    groups[status].push(epic)
  })
  
  return groups
})

// Create columns from grouped epics
const kanbanColumns = computed(() => {
  const statusGroups = groupedEpics.value
  const columns = []
  
  for (const [status, epics] of Object.entries(statusGroups)) {
    if (epics.length > 0) {
      // Get color based on status
      let color = 'primary'
      const statusLower = status.toLowerCase()
      
      if (statusLower.includes('progress') || statusLower.includes('development')) {
        color = 'warning'
      } else if (statusLower.includes('done') || statusLower.includes('closed')) {
        color = 'success'
      } else if (statusLower.includes('cancel')) {
        color = 'error'
      } else if (statusLower.includes('todo') || statusLower.includes('new')) {
        color = 'info'
      }
      
      columns.push({
        title: status,
        status: status,
        color: color
      })
    }
  }
  
  return columns
})

// Total epics count
const totalEpics = computed(() => epics.value.length)
</script>

<template>
  <div class="pa-4 bg-grey-lighten-4" style="width: 100%; min-height: 100vh">
    <!-- Kanban Board Header -->
    <div v-if="totalEpics > 0" class="mb-4">
      <div class="d-flex align-center mb-2">
        <v-icon class="mr-2" size="large">mdi-view-column</v-icon>
        <h2 class="text-h4">Epic Board</h2>
        <v-spacer />
        <v-chip
          color="primary"
          variant="tonal"
          size="large"
          class="text-subtitle-1"
        >
          {{ totalEpics }} Epic{{ totalEpics > 1 ? 's' : '' }}
        </v-chip>
      </div>
    </div>

    <!-- Kanban Board -->
    <div v-if="totalEpics > 0" class="kanban-board">
      <div class="d-flex ga-4 align-start" style="overflow-x: auto; min-height: 70vh;">
        <KanbanColumn
          v-for="column in kanbanColumns"
          :key="column.status"
          :title="column.title"
          :status="column.status"
          :epics="groupedEpics[column.status]"
          :color="column.color"
        />
      </div>
    </div>

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
</template>

<style scoped>
.kanban-board {
  position: relative;
}

.kanban-board::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(33, 150, 243, 0.05) 100%);
  border-radius: 12px;
  pointer-events: none;
}

/* Custom scrollbar for horizontal scrolling */
.kanban-board div::-webkit-scrollbar {
  height: 8px;
}

.kanban-board div::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

.kanban-board div::-webkit-scrollbar-thumb {
  background: rgba(25, 118, 210, 0.3);
  border-radius: 4px;
}

.kanban-board div::-webkit-scrollbar-thumb:hover {
  background: rgba(25, 118, 210, 0.5);
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .kanban-board .d-flex {
    min-width: max-content;
  }
}

/* Animation for smooth transitions */
.kanban-board .d-flex {
  transition: all 0.3s ease;
}
</style>