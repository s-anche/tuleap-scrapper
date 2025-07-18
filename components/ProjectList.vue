<template>
  <v-card class="mb-6">
    <v-card-title class="d-flex align-center pa-6">
      <v-icon class="mr-3" size="large">mdi-folder-multiple</v-icon>
      <span class="text-h4">Projects</span>
      <v-spacer></v-spacer>
      <div class="d-flex align-center">
        <v-text-field
          v-model="searchQuery"
          placeholder="Search projects..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="default"
          class="mr-4"
          style="min-width: 350px"
          @input="debouncedSearch"
        />
        <v-select
          v-model="selectedFilter"
          :items="filterOptions"
          variant="outlined"
          density="default"
          style="min-width: 250px"
          @update:model-value="() => loadProjects()"
        />
      </div>
    </v-card-title>

    <v-card-text class="pa-6">
      <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-4" />
      
      <v-alert v-else-if="error" type="error" class="mb-6">
        {{ error }}
      </v-alert>
      
      <v-alert v-else-if="projects.length === 0" type="info" class="mb-6">
        No projects found
      </v-alert>
      
      <v-row v-else :no-gutters="false">
        <v-col
          v-for="project in projects"
          :key="project.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
          xl="2"
          class="pa-3"
        >
          <v-card
            :color="selectedProject?.id === project.id ? 'primary' : undefined"
            :variant="selectedProject?.id === project.id ? 'elevated' : 'outlined'"
            class="project-card h-100"
            @click="selectProject(project)"
            hover
          >
            <v-card-title class="d-flex align-center pa-4">
              <v-icon class="mr-3" size="large">mdi-folder</v-icon>
              <div class="flex-grow-1">
                <div class="text-h6">{{ project.label }}</div>
                <v-chip size="small" variant="outlined" class="mt-1">
                  {{ project.shortname }}
                </v-chip>
              </div>
            </v-card-title>
            
            <v-card-text class="pa-4 pt-0">
              <p class="text-body-1 mb-4" style="min-height: 48px; line-height: 1.5;">
                {{ project.description || 'No description' }}
              </p>
              
              <div class="d-flex align-center justify-space-between">
                <v-chip 
                  :color="project.status === 'active' ? 'success' : 'default'"
                  size="small"
                  variant="tonal"
                >
                  {{ project.status }}
                </v-chip>
                <v-chip 
                  :color="project.is_public ? 'info' : 'warning'"
                  size="small"
                  variant="tonal"
                >
                  <v-icon start>{{ project.is_public ? 'mdi-earth' : 'mdi-lock' }}</v-icon>
                  {{ project.is_public ? 'Public' : 'Private' }}
                </v-chip>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-actions v-if="hasMore && !loading" class="justify-center pa-6">
      <v-btn @click="loadMore" color="primary" variant="outlined" size="large">
        <v-icon start>mdi-refresh</v-icon>
        Load More Projects
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { apiService } from '@/services/api'
import type { Project, ProjectQuery } from '@/types/api'

const emit = defineEmits<{
  projectSelected: [project: Project]
}>()

const projects = ref<Project[]>([])
const selectedProject = ref<Project | null>(null)
const loading = ref(false)
const error = ref('')
const searchQuery = ref('')
const selectedFilter = ref('all')
const currentPage = ref(0)
const pageSize = 20
const hasMore = ref(true)

const filterOptions = [
  { title: 'All Projects', value: 'all' },
  { title: 'Projects I\'m Member Of', value: 'member' },
  { title: 'Projects I\'m Admin Of', value: 'admin' }
]

let searchTimeout: ReturnType<typeof setTimeout>

const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    loadProjects()
  }, 500)
}

const buildQuery = (): ProjectQuery => {
  const query: ProjectQuery = {}
  
  if (searchQuery.value.trim()) {
    query.shortname = searchQuery.value.trim()
  }
  
  switch (selectedFilter.value) {
    case 'member':
      query.is_member_of = true
      break
    case 'admin':
      query.is_admin_of = true
      break
  }
  
  return query
}

const loadProjects = async (append = false) => {
  if (loading.value) return
  
  loading.value = true
  error.value = ''
  
  try {
    const offset = append ? currentPage.value * pageSize : 0
    const query = buildQuery()
    
    const response = await apiService.getProjects({
      limit: pageSize,
      offset,
      query: Object.keys(query).length > 0 ? query : undefined
    })
    
    if (append) {
      projects.value = [...projects.value, ...response]
    } else {
      projects.value = response
      currentPage.value = 0
    }
    
    hasMore.value = response.length === pageSize
    
    if (append) {
      currentPage.value++
    }
  } catch (err: any) {
    error.value = err.response?.data?.error?.message || 'Failed to load projects'
  } finally {
    loading.value = false
  }
}

const loadMore = () => {
  currentPage.value++
  loadProjects(true)
}

const selectProject = (project: Project) => {
  selectedProject.value = project
  emit('projectSelected', project)
}

onMounted(() => {
  loadProjects()
})
</script>

<style scoped>
.project-card {
  cursor: pointer;
  transition: all 0.2s;
}
</style>