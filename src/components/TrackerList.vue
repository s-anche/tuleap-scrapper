<template>
  <v-card class="mb-6">
    <v-card-title class="d-flex align-center pa-6">
      <v-icon class="mr-3" size="large">mdi-format-list-group</v-icon>
      <span class="text-h4">Trackers</span>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="searchQuery"
        placeholder="Search trackers..."
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        density="default"
        style="min-width: 350px"
        @input="debouncedSearch"
      />
    </v-card-title>

    <v-card-text class="pa-6">
      <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-4" />
      
      <v-alert v-else-if="error" type="error" class="mb-6">
        {{ error }}
      </v-alert>
      
      <v-alert v-else-if="trackers.length === 0" type="info" class="mb-6">
        No trackers found
      </v-alert>
      
      <v-row v-else :no-gutters="false">
        <v-col
          v-for="tracker in trackers"
          :key="tracker.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
          xl="2"
          class="pa-3"
        >
          <v-card
            :color="selectedTracker?.id === tracker.id ? 'primary' : undefined"
            :variant="selectedTracker?.id === tracker.id ? 'elevated' : 'outlined'"
            class="tracker-card h-100"
            @click="selectTracker(tracker)"
            hover
          >
            <v-card-title class="d-flex align-center pa-4">
              <v-avatar 
                size="large" 
                :color="tracker.color_name || 'grey'"
                class="mr-3"
              >
                <v-icon color="white" size="large">mdi-format-list-group</v-icon>
              </v-avatar>
              <div class="flex-grow-1">
                <div class="text-h6">{{ tracker.label }}</div>
              </div>
            </v-card-title>
            
            <v-card-text class="pa-4 pt-0">
              <p class="text-body-1 mb-4" style="min-height: 48px; line-height: 1.5;">
                {{ tracker.description || 'No description' }}
              </p>
              
              <div class="d-flex justify-space-between align-center">
                <v-chip size="small" color="primary" variant="tonal">
                  <v-icon start>mdi-format-list-bulleted</v-icon>
                  {{ tracker.item_name }}
                </v-chip>
                <v-chip size="small" variant="outlined">
                  {{ tracker.project.label }}
                </v-chip>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { apiService } from '@/services/api'
import type { Tracker } from '@/types/api'

interface Props {
  projectId: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  trackerSelected: [tracker: Tracker]
}>()

const trackers = ref<Tracker[]>([])
const selectedTracker = ref<Tracker | null>(null)
const loading = ref(false)
const error = ref('')
const searchQuery = ref('')

let searchTimeout: ReturnType<typeof setTimeout>

const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    loadTrackers()
  }, 500)
}

const loadTrackers = async () => {
  if (loading.value) return
  
  loading.value = true
  error.value = ''
  
  try {
    const response = await apiService.getProjectTrackers(props.projectId, {
      representation: 'full',
      limit: 50
    })
    
    let filteredTrackers = response
    
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase()
      filteredTrackers = response.filter((tracker: Tracker) =>
        tracker.label.toLowerCase().includes(query) ||
        tracker.item_name.toLowerCase().includes(query) ||
        tracker.description?.toLowerCase().includes(query)
      )
    }
    
    trackers.value = filteredTrackers
  } catch (err: any) {
    error.value = err.response?.data?.error?.message || 'Failed to load trackers'
  } finally {
    loading.value = false
  }
}

const selectTracker = (tracker: Tracker) => {
  selectedTracker.value = tracker
  emit('trackerSelected', tracker)
}

watch(() => props.projectId, () => {
  if (props.projectId) {
    selectedTracker.value = null
    loadTrackers()
  }
})

onMounted(() => {
  if (props.projectId) {
    loadTrackers()
  }
})
</script>

<style scoped>
.tracker-card {
  cursor: pointer;
  transition: all 0.2s;
}
</style>