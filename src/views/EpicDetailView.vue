<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { apiService } from '@/services/api'
import type { Epic } from '@/types/api'
import EpicTreeView from '@/components/EpicTreeView.vue'

const route = useRoute()
const router = useRouter()

const epic = ref<Epic | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const epicId = computed(() => {
  const id = route.params.id
  return typeof id === 'string' ? parseInt(id) : null
})

const loadEpic = async () => {
  if (!epicId.value) {
    error.value = 'Invalid epic ID'
    loading.value = false
    return
  }

  try {
    loading.value = true
    error.value = null
    epic.value = await apiService.getEpicById(epicId.value)
  } catch (err: unknown) {
    error.value = (err as Error).message || 'Failed to load epic'
    console.error('Error loading epic:', err)
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  loadEpic()
})
</script>

<template>
  <v-container fluid class="pa-4">
    <!-- Header with breadcrumbs -->
    <div class="d-flex align-center mb-4">
      <v-btn
        variant="text"
        prepend-icon="mdi-arrow-left"
        @click="goBack"
        class="mr-3"
      >
        Back
      </v-btn>
      <v-breadcrumbs
        :items="[
          { title: 'Home', disabled: false, to: '/' },
          { title: `Epic #${epicId}`, disabled: true }
        ]"
        class="pa-0"
      />
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="text-center py-8">
      <v-progress-circular
        indeterminate
        size="64"
        color="primary"
      />
      <div class="mt-4 text-h6">Loading epic details...</div>
    </div>

    <!-- Error state -->
    <v-alert
      v-else-if="error"
      type="error"
      variant="tonal"
      closable
      class="mb-4"
    >
      {{ error }}
    </v-alert>

    <!-- Epic content -->
    <template v-else-if="epic">
      <!-- Epic header -->
      <v-card class="mb-6" elevation="2">
        <v-card-title class="d-flex align-center pa-6">
          <div class="d-flex align-center flex-grow-1">
            <v-chip
              class="mr-3"
              variant="flat"
              size="default"
              :color="epic.status === 'Done' ? 'success' : epic.status === 'Development in progress' ? 'warning' : 'info'"
            >
              {{ epic.status }}
            </v-chip>
            <div>
              <div class="text-h4">{{ epic.title }}</div>
              <div class="text-subtitle-1 text-grey-darken-1 mt-1">
                {{ epic.project.label }} • Epic #{{ epic.id }}
              </div>
            </div>
          </div>
          <div v-if="epic.project.icon" class="text-h4 ml-4">
            {{ epic.project.icon }}
          </div>
        </v-card-title>
        
        <v-card-text class="pa-6 pt-0">
          <v-row>
            <v-col cols="12" md="4">
              <div class="text-overline mb-2">Leading Team</div>
              <v-chip
                v-if="epic.leadTeam"
                variant="tonal"
                color="success"
              >
                {{ epic.leadTeam }}
              </v-chip>
              <span v-else class="text-grey-darken-1">Not assigned</span>
            </v-col>
            <v-col cols="12" md="4">
              <div class="text-overline mb-2">Estimation</div>
              <div class="d-flex gap-2">
                <v-chip
                  v-if="epic.estimation"
                  variant="tonal"
                  color="info"
                >
                  {{ epic.estimation }} pts
                </v-chip>
                <v-chip
                  v-if="epic.remainingEffort"
                  variant="tonal"
                  color="warning"
                >
                  {{ epic.remainingEffort }} remaining
                </v-chip>
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="text-overline mb-2">Actions</div>
              <v-btn
                variant="outlined"
                :href="epic.htmlUrl"
                target="_blank"
                rel="noopener noreferrer"
                prepend-icon="mdi-open-in-new"
              >
                View in Tuleap
              </v-btn>
            </v-col>
          </v-row>
          
          <v-divider class="my-4" />
          
          <div v-if="epic.summary" class="mb-4">
            <div class="text-overline mb-2">Summary</div>
            <div class="text-body-1 summary-content" v-html="epic.summary"></div>
          </div>
        </v-card-text>
      </v-card>

      <!-- Epic tree view -->
      <EpicTreeView :epic="epic" />
    </template>
  </v-container>
</template>

<style scoped>
.v-breadcrumbs {
  padding: 0;
}

.summary-content {
  line-height: 1.6;
}

.summary-content :deep(ul) {
  margin: 16px 0;
  padding-left: 24px;
}

.summary-content :deep(ol) {
  margin: 16px 0;
  padding-left: 24px;
}

.summary-content :deep(li) {
  margin: 8px 0;
}

.summary-content :deep(p) {
  margin: 12px 0;
}

.summary-content :deep(h1),
.summary-content :deep(h2),
.summary-content :deep(h3),
.summary-content :deep(h4),
.summary-content :deep(h5),
.summary-content :deep(h6) {
  margin: 16px 0 8px 0;
  font-weight: 600;
}

.summary-content :deep(strong) {
  font-weight: 600;
}

.summary-content :deep(em) {
  font-style: italic;
}

.summary-content :deep(blockquote) {
  margin: 16px 0;
  padding: 12px 16px;
  border-left: 4px solid rgba(var(--v-theme-primary), 0.4);
  background-color: rgba(var(--v-theme-surface), 0.5);
}

.summary-content :deep(code) {
  background-color: rgba(var(--v-theme-surface), 0.8);
  padding: 2px 4px;
  border-radius: 4px;
  font-family: 'Roboto Mono', monospace;
}

.summary-content :deep(pre) {
  background-color: rgba(var(--v-theme-surface), 0.8);
  padding: 12px;
  border-radius: 4px;
  overflow-x: auto;
  margin: 16px 0;
}

.summary-content :deep(a) {
  color: rgb(var(--v-theme-primary));
  text-decoration: none;
}

.summary-content :deep(a:hover) {
  text-decoration: underline;
}
</style>