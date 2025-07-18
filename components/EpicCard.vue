<script setup lang="ts">
import { computed } from 'vue'
import type { Epic } from '@/types/api'

interface Props {
  epic: Epic
}

const props = defineProps<Props>()

const statusColor = computed(() => {
  switch (props.epic.status?.toLowerCase()) {
    case 'development in progress':
      return 'warning'
    case 'done':
      return 'success'
    case 'to do':
      return 'info'
    case 'cancelled':
      return 'error'
    default:
      return 'primary'
  }
})


const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const relatedArtifactsCount = computed(() => {
  if (!props.epic.links) return 0
  return props.epic.links.features.length + 
         props.epic.links.stories.length + 
         props.epic.links.tasks.length + 
         props.epic.links.defects.length
})
</script>

<template>
  <v-card
    class="epic-card h-100"
    elevation="2"
    hover
    :to="`/epic/${epic.id}`"
  >
    <!-- Header with Status and ID -->
    <v-card-title class="d-flex align-center pa-4 pb-2">
      <div class="d-flex align-center flex-grow-1 mr-3">
        <v-chip
          class="mr-3"
          variant="flat"
          size="small"
          :color="statusColor"
        >
          {{ epic.status }}
        </v-chip>
        <v-chip
          variant="tonal"
          size="small"
          color="primary"
        >
          #{{ epic.id }}
        </v-chip>
      </div>
      <div v-if="epic.project.icon" class="text-h6">
        {{ epic.project.icon }}
      </div>
    </v-card-title>

    <!-- Epic Title -->
    <v-card-subtitle class="pa-4 pt-0">
      <div class="text-h6 font-weight-medium text-wrap">
        {{ epic.title }}
      </div>
      <div v-if="epic.project.label" class="text-body-2 text-grey-darken-1 mt-1">
        {{ epic.project.label }}
      </div>
    </v-card-subtitle>
    
    <!-- Epic Details -->
    <v-card-text class="pa-4 pt-2">
      <v-row dense>
        <v-col cols="12" lg="6">
          <div class="info-section">
            <div class="text-overline mb-1">Leading Team</div>
            <div class="text-body-2">
              <v-chip
                v-if="epic.leadTeam"
                variant="tonal"
                size="small"
                color="success"
                class="text-caption"
              >
                {{ epic.leadTeam }}
              </v-chip>
              <span v-else class="text-grey-darken-1">Not assigned</span>
            </div>
          </div>
        </v-col>
        
        <v-col cols="12" lg="6">
          <div class="info-section">
            <div class="text-overline mb-1">Estimation</div>
            <div class="text-body-2">
              <div v-if="epic.estimation || epic.remainingEffort" class="d-flex gap-1">
                <v-chip
                  v-if="epic.estimation"
                  variant="tonal"
                  size="small"
                  color="info"
                  class="text-caption"
                >
                  {{ epic.estimation }} pts
                </v-chip>
                <v-chip
                  v-if="epic.remainingEffort"
                  variant="tonal"
                  size="small"
                  color="warning"
                  class="text-caption"
                >
                  {{ epic.remainingEffort }} remaining
                </v-chip>
              </div>
              <span v-else class="text-grey-darken-1">Not estimated</span>
            </div>
          </div>
        </v-col>
        
        <v-col cols="12" lg="6">
          <div class="info-section">
            <div class="text-overline mb-1">Last Updated</div>
            <div class="text-body-2">{{ formatDate(epic.lastUpdateDate) }}</div>
          </div>
        </v-col>
        
        <v-col cols="12" lg="6">
          <div class="info-section">
            <div class="text-overline mb-1">Related Artifacts</div>
            <div class="text-body-2">
              <v-chip
                v-if="relatedArtifactsCount > 0"
                variant="tonal"
                size="small"
                color="secondary"
                class="text-caption"
              >
                {{ relatedArtifactsCount }} linked
              </v-chip>
              <span v-else class="text-grey-darken-1">None linked</span>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
    
    <!-- Actions -->
    <v-card-actions class="pa-4 pt-0">
      <v-tooltip
        v-if="epic.summary"
        location="top"
        max-width="500"
      >
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            variant="text"
            size="small"
            color="primary"
            @click.stop
          >
            <v-icon left>mdi-information-outline</v-icon>
            Summary
          </v-btn>
        </template>
        <div class="pa-3">
          <div class="text-subtitle-2 mb-2">Epic Summary</div>
          <div class="text-body-2 summary-tooltip" v-html="epic.summary"></div>
        </div>
      </v-tooltip>
      
      <v-spacer />
      
      <v-btn
        variant="outlined"
        size="small"
        :href="epic.htmlUrl"
        target="_blank"
        rel="noopener noreferrer"
        color="primary"
        @click.stop
      >
        <v-icon left>mdi-open-in-new</v-icon>
        View in Tuleap
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.epic-card {
  transition: all 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

.epic-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
}

.epic-card:active {
  transform: translateY(0px);
}

.info-section {
  min-height: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.v-card-actions {
  margin-top: auto;
}

.text-wrap {
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
}

@media (max-width: 959px) {
  .info-section {
    min-height: 50px;
  }
}

@media (max-width: 599px) {
  .epic-card .v-card-title {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .epic-card .v-card-title > div {
    margin-bottom: 8px;
  }
}

.summary-tooltip {
  max-width: 500px;
  max-height: 200px;
  overflow-y: auto;
  line-height: 1.4;
}

.summary-tooltip :deep(ul),
.summary-tooltip :deep(ol) {
  margin: 8px 0;
  padding-left: 20px;
}

.summary-tooltip :deep(li) {
  margin: 4px 0;
}

.summary-tooltip :deep(p) {
  margin: 8px 0;
}

.summary-tooltip :deep(strong) {
  font-weight: 600;
}

.summary-tooltip :deep(em) {
  font-style: italic;
}
</style>