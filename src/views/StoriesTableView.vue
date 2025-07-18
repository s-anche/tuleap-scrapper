<template>
  <div class="pa-4">
    <div class="d-flex align-center mb-4">
      <v-icon class="mr-2" size="large">mdi-table</v-icon>
      <h2 class="text-h4">Stories & Tasks</h2>
      <v-spacer />
      <div class="d-flex align-center ga-2">
        <v-chip
          v-if="tableRows.length > 0"
          color="primary"
          variant="tonal"
          size="large"
          class="text-subtitle-1"
        >
          {{ tableRows.length }} Item{{ tableRows.length > 1 ? 's' : '' }}
        </v-chip>
        <v-btn
          v-if="tableRows.length > 0"
          @click="copyToClipboard"
          color="primary"
          variant="outlined"
          size="small"
          prepend-icon="mdi-content-copy"
        >
          Copy to Excel
        </v-btn>
      </div>
    </div>

    <!-- Search and Filters -->
    <v-card v-if="tableRows.length > 0" class="mb-4">
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="search"
              label="Search"
              placeholder="Search by ID, title, or status..."
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="compact"
              clearable
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="statusFilter"
              label="Status"
              :items="statusOptions"
              variant="outlined"
              density="compact"
              clearable
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="typeFilter"
              label="Type"
              :items="typeOptions"
              variant="outlined"
              density="compact"
              clearable
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Data Table -->
    <v-card v-if="tableRows.length > 0">
      <v-data-table
        :headers="headers"
        :items="filteredRows"
        :search="search"
        :loading="isLoading"
        item-key="id"
        show-select
        :items-per-page="50"
        :sort-by="[{ key: 'id', order: 'asc' }]"
        class="elevation-1"
      >
        <template v-slot:item.id="{ item }">
          <v-chip
            :color="getTypeColor(item.type)"
            variant="tonal"
            size="small"
            class="font-weight-bold"
          >
            {{ item.id }}
          </v-chip>
        </template>

        <template v-slot:item.parentId="{ item }">
          <span v-if="item.parentId" class="text-caption">
            {{ item.parentId }}
          </span>
          <span v-else class="text-caption text-grey">—</span>
        </template>

        <template v-slot:item.title="{ item }">
          <div class="d-flex align-center">
            <v-icon 
              :icon="getTypeIcon(item.type)" 
              :color="getTypeColor(item.type)"
              size="small"
              class="mr-2"
            />
            <a 
              :href="item.htmlUrl" 
              target="_blank" 
              class="text-decoration-none"
              @click.stop
            >
              {{ item.title }}
            </a>
          </div>
        </template>

        <template v-slot:item.status="{ item }">
          <v-chip
            :color="getStatusColor(item.status)"
            variant="tonal"
            size="small"
          >
            {{ item.status }}
          </v-chip>
        </template>

        <template v-slot:item.points="{ item }">
          <span v-if="item.points !== null" class="font-weight-bold">
            {{ item.points }}
          </span>
          <span v-else class="text-grey">—</span>
        </template>

        <template v-slot:item.sprint="{ item }">
          <v-chip
            v-if="item.sprint"
            color="info"
            variant="outlined"
            size="small"
          >
            {{ item.sprint }}
          </v-chip>
          <span v-else class="text-grey">—</span>
        </template>

        <template v-slot:bottom>
          <div class="text-center pa-2">
            <v-pagination
              v-model="page"
              :length="Math.ceil(filteredRows.length / itemsPerPage)"
              :total-visible="7"
            />
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Loading State -->
    <v-card v-else-if="isLoading" class="text-center pa-12">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      />
      <p class="text-h6 mt-4">Loading stories and tasks...</p>
    </v-card>

    <!-- Empty State -->
    <v-card v-else class="text-center pa-12">
      <v-icon size="64" color="grey-lighten-2">mdi-table-off</v-icon>
      <p class="text-h6 mt-4">No stories or tasks found</p>
      <p class="text-body-1">Load some epics from the sidebar to see their stories and tasks here.</p>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useEpicStore } from '@/stores/epics'
import { storeToRefs } from 'pinia'
import { useStoriesTable, type TableRow } from '@/composables/useStoriesTable'

// Store
const epicStore = useEpicStore()
const { epics, loading } = storeToRefs(epicStore)

// Composables
const { flattenEpicTreeData } = useStoriesTable()

// Table state
const search = ref('')
const statusFilter = ref('')
const typeFilter = ref('')
const page = ref(1)
const itemsPerPage = ref(50)
const tableRows = ref<TableRow[]>([])
const tableLoading = ref(false)

// Table headers
const headers = [
  { title: 'ID', value: 'id', sortable: true, width: '100px' },
  { title: 'Parent ID', value: 'parentId', sortable: true, width: '100px' },
  { title: 'Title', value: 'title', sortable: true },
  { title: 'Status', value: 'status', sortable: true, width: '150px' },
  { title: 'Points', value: 'points', sortable: true, width: '100px' },
  { title: 'Sprint', value: 'sprint', sortable: true, width: '150px' },
]

// Watch for changes in epics and update table data
watch(epics, async (newEpics) => {
  if (newEpics.length > 0) {
    tableLoading.value = true
    try {
      tableRows.value = await flattenEpicTreeData(newEpics)
    } catch (error) {
      console.error('Error flattening epic tree data:', error)
    } finally {
      tableLoading.value = false
    }
  } else {
    tableRows.value = []
  }
}, { immediate: true })

// Combined loading state
const isLoading = computed(() => loading.value || tableLoading.value)

// Filter options
const statusOptions = computed(() => {
  const statuses = [...new Set(tableRows.value.map(row => row.status))]
  return statuses.sort()
})

const typeOptions = computed(() => [
  { title: 'Story', value: 'story' },
  { title: 'Task', value: 'task' }
])

// Filtered rows based on search and filters
const filteredRows = computed(() => {
  let filtered = tableRows.value

  if (statusFilter.value) {
    filtered = filtered.filter(row => row.status === statusFilter.value)
  }

  if (typeFilter.value) {
    filtered = filtered.filter(row => row.type === typeFilter.value)
  }

  return filtered
})

// Helper functions
const getTypeIcon = (type: string) => {
  switch (type) {
    case 'story':
      return 'mdi-book-open-variant'
    case 'task':
      return 'mdi-checkbox-marked-circle'
    default:
      return 'mdi-circle'
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case 'story':
      return 'blue'
    case 'task':
      return 'green'
    default:
      return 'grey'
  }
}

const getStatusColor = (status: string) => {
  const statusLower = status.toLowerCase()
  
  if (statusLower.includes('done') || statusLower.includes('closed')) {
    return 'success'
  } else if (statusLower.includes('progress') || statusLower.includes('development')) {
    return 'warning'
  } else if (statusLower.includes('cancel')) {
    return 'error'
  } else if (statusLower.includes('todo') || statusLower.includes('new')) {
    return 'info'
  }
  
  return 'default'
}

const copyToClipboard = async () => {
  try {
    const headerRow = ['ID', 'Parent ID', 'Title', 'Status', 'Points', 'Sprint', 'Type', 'URL']
    const dataRows = filteredRows.value.map(row => [
      row.id,
      row.parentId || '',
      row.title,
      row.status,
      row.points || '',
      row.sprint || '',
      row.type,
      row.htmlUrl
    ])
    
    const allRows = [headerRow, ...dataRows]
    const tsvContent = allRows.map(row => row.join('\t')).join('\n')
    
    await navigator.clipboard.writeText(tsvContent)
    console.log('Table data copied to clipboard')
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
  }
}
</script>

<style scoped>
.v-data-table {
  background: white;
}

.v-data-table >>> .v-data-table__wrapper {
  border-radius: 8px;
}

.v-data-table >>> th {
  background-color: #f5f5f5 !important;
  font-weight: 600;
}

.v-data-table >>> tr:hover {
  background-color: #f8f9fa !important;
}

a {
  color: inherit;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>