<template>
  <div>
    <div class="d-flex align-center mb-6">
      <v-text-field
        v-model="searchQuery"
        placeholder="Search artifacts..."
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        density="default"
        class="mr-4"
        style="min-width: 350px"
        @input="debouncedSearch"
      />
      <v-select
        v-model="selectedStatus"
        :items="statusOptions"
        label="Status"
        variant="outlined"
        density="default"
        style="min-width: 180px"
        @update:model-value="() => loadArtifacts()"
      />
    </div>

    <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-4" />
    
    <v-alert v-else-if="error" type="error" class="mb-4">
      {{ error }}
    </v-alert>
    
    <v-alert v-else-if="artifacts.length === 0" type="info" class="mb-4">
      No {{ artifactType }}s found
    </v-alert>
    
    <div v-else>
      <v-card
        v-for="artifact in artifacts"
        :key="artifact.id"
        class="mb-4 artifact-card"
        variant="outlined"
        @click="selectArtifact(artifact)"
        hover
      >
        <v-card-title class="d-flex align-center pa-4">
          <v-icon class="mr-3" size="large" :color="getArtifactIcon(artifactType).color">
            {{ getArtifactIcon(artifactType).icon }}
          </v-icon>
          {{ getArtifactTitle(artifact) }}
          <v-spacer></v-spacer>
          <v-chip size="default" variant="outlined">
            #{{ artifact.id }}
          </v-chip>
        </v-card-title>
        
        <v-card-text class="pa-4 pt-0">
          <div class="d-flex align-center mb-2">
            <v-chip size="default" color="primary" variant="tonal" class="mr-3">
              <v-icon start>mdi-format-list-bulleted</v-icon>
              {{ artifact.tracker.label }}
            </v-chip>
            <v-chip size="default" variant="outlined">
              {{ artifact.project.label }}
            </v-chip>
          </div>
          
          <div class="d-flex align-center justify-space-between mb-2">
            <v-chip 
              size="default" 
              :color="getStatusColor(artifact)"
              variant="tonal"
            >
              <v-icon start>{{ getStatusIcon(artifact) }}</v-icon>
              {{ getArtifactStatus(artifact) }}
            </v-chip>
            <span class="text-caption text-medium-emphasis">
              Updated: {{ formatDate(artifact.last_update_date) }}
            </span>
          </div>
          
          <div v-if="artifact.values" class="artifact-values">
            <v-chip
              v-for="value in getDisplayValues(artifact.values)"
              :key="value.field_id"
              size="default"
              variant="outlined"
              class="mr-2 mb-2"
            >
              <span class="text-caption">{{ value.label }}: {{ formatValue(value) }}</span>
            </v-chip>
          </div>
        </v-card-text>
      </v-card>
    </div>

    <div v-if="hasMore && !loading" class="text-center mt-6">
      <v-btn @click="loadMore" color="primary" variant="outlined" size="large">
        <v-icon start>mdi-refresh</v-icon>
        Load More
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { apiService } from '@/services/api'
import type { Artifact, ArtifactValue, ArtifactType } from '@/types/api'

interface Props {
  trackerId: number
  artifactType: ArtifactType
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Artifacts'
})

const emit = defineEmits<{
  artifactSelected: [artifact: Artifact]
}>()

const artifacts = ref<Artifact[]>([])
const loading = ref(false)
const error = ref('')
const searchQuery = ref('')
const selectedStatus = ref('')
const currentPage = ref(0)
const pageSize = 20
const hasMore = ref(true)

const statusOptions = [
  { title: 'All Status', value: '' },
  { title: 'Open', value: 'open' },
  { title: 'Closed', value: 'closed' },
  { title: 'In Progress', value: 'in_progress' }
]

let searchTimeout: ReturnType<typeof setTimeout>

const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    loadArtifacts()
  }, 500)
}

const buildQuery = () => {
  const query: any = {}
  
  if (searchQuery.value.trim()) {
    query.title = {
      operator: 'contains',
      value: searchQuery.value.trim()
    }
  }
  
  if (selectedStatus.value) {
    query.status = selectedStatus.value
  }
  
  return query
}

const loadArtifacts = async (append = false) => {
  if (loading.value) return
  
  loading.value = true
  error.value = ''
  
  try {
    const offset = append ? currentPage.value * pageSize : 0
    const query = buildQuery()
    
    const response = await apiService.getTrackerArtifacts(props.trackerId, {
      limit: pageSize,
      offset,
      values: 'all',
      query: Object.keys(query).length > 0 ? query : undefined
    })
    
    if (append) {
      artifacts.value = [...artifacts.value, ...response]
    } else {
      artifacts.value = response
      currentPage.value = 0
    }
    
    hasMore.value = response.length === pageSize
    
    if (append) {
      currentPage.value++
    }
  } catch (err: any) {
    error.value = err.response?.data?.error?.message || `Failed to load ${props.artifactType}s`
  } finally {
    loading.value = false
  }
}

const loadMore = () => {
  currentPage.value++
  loadArtifacts(true)
}

const selectArtifact = (artifact: Artifact) => {
  emit('artifactSelected', artifact)
}

const getArtifactTitle = (artifact: Artifact): string => {
  if (artifact.title) return artifact.title
  
  const titleValue = artifact.values?.find(v => 
    v.label.toLowerCase().includes('title') || 
    v.label.toLowerCase().includes('summary')
  )
  
  return titleValue?.value || `${props.artifactType} #${artifact.id}`
}

const getArtifactStatus = (artifact: Artifact): string => {
  if (artifact.status) return artifact.status
  
  const statusValue = artifact.values?.find(v => 
    v.label.toLowerCase().includes('status')
  )
  
  return statusValue?.value || 'Unknown'
}

const getStatusClass = (artifact: Artifact): string => {
  const status = getArtifactStatus(artifact).toLowerCase()
  
  if (status.includes('done') || status.includes('closed')) return 'status-done'
  if (status.includes('progress') || status.includes('active')) return 'status-progress'
  if (status.includes('todo') || status.includes('new')) return 'status-todo'
  
  return 'status-default'
}

const getDisplayValues = (values: ArtifactValue[]): ArtifactValue[] => {
  return values
    .filter(v => 
      !v.label.toLowerCase().includes('title') && 
      !v.label.toLowerCase().includes('status') &&
      v.value !== null &&
      v.value !== ''
    )
    .slice(0, 3)
}

const formatValue = (value: ArtifactValue): string => {
  if (Array.isArray(value.value)) {
    return value.value.map(v => v.display_name || v.label || v).join(', ')
  }
  
  if (typeof value.value === 'object' && value.value !== null) {
    return value.value.display_name || value.value.label || JSON.stringify(value.value)
  }
  
  return String(value.value)
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString()
}

const getArtifactIcon = (type: ArtifactType) => {
  const icons = {
    epic: { icon: 'mdi-lightning-bolt', color: 'purple' },
    feature: { icon: 'mdi-star', color: 'blue' },
    task: { icon: 'mdi-check', color: 'green' },
    story: { icon: 'mdi-book', color: 'orange' }
  }
  return icons[type] || { icon: 'mdi-file', color: 'grey' }
}

const getStatusColor = (artifact: Artifact): string => {
  const status = getArtifactStatus(artifact).toLowerCase()
  
  if (status.includes('done') || status.includes('closed')) return 'success'
  if (status.includes('progress') || status.includes('active')) return 'warning'
  if (status.includes('todo') || status.includes('new')) return 'info'
  
  return 'default'
}

const getStatusIcon = (artifact: Artifact): string => {
  const status = getArtifactStatus(artifact).toLowerCase()
  
  if (status.includes('done') || status.includes('closed')) return 'mdi-check'
  if (status.includes('progress') || status.includes('active')) return 'mdi-clock'
  if (status.includes('todo') || status.includes('new')) return 'mdi-circle-outline'
  
  return 'mdi-circle'
}

watch(() => props.trackerId, () => {
  if (props.trackerId) {
    loadArtifacts()
  }
})

onMounted(() => {
  if (props.trackerId) {
    loadArtifacts()
  }
})
</script>

<style scoped>
.artifact-card {
  cursor: pointer;
  transition: all 0.2s;
}
</style>