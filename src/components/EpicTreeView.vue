<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { apiService } from '@/services/api'
import type { Epic, TuleapArtifact } from '@/types/api'

interface Props {
  epic: Epic
}

interface TreeNode {
  id: string
  title: string
  children?: TreeNode[]
  type: 'epic' | 'feature' | 'story' | 'task' | 'defect'
  artifact?: TuleapArtifact
  status?: string
  points?: number | null
  remainingEffort?: number | null
  sprint?: string | null
  linkedArtifactCount?: number
  percentWithPoints?: number
  htmlUrl?: string
}

const props = defineProps<Props>()

const loading = ref(true)
const error = ref<string | null>(null)
const treeData = ref<TreeNode[]>([])
const openNodes = ref<string[]>(['epic'])

const loadTreeData = async () => {
  try {
    loading.value = true
    error.value = null
    
    const epicTreeData = await apiService.getEpicTreeData(props.epic)
    
    // Build tree structure
    const epicNode: TreeNode = {
      id: 'epic',
      title: props.epic.title,
      type: 'epic',
      status: props.epic.status,
      points: props.epic.estimation,
      remainingEffort: props.epic.remainingEffort,
      htmlUrl: props.epic.htmlUrl,
      children: []
    }

    // Add features with their sub-artifacts
    epicTreeData.features.forEach(feature => {
      const featureNode: TreeNode = {
        id: `feature-${feature.artifact.id}`,
        title: feature.artifact.title,
        type: 'feature',
        artifact: feature.artifact,
        status: feature.artifact.status,
        points: feature.points,
        remainingEffort: feature.remainingEffort,
        linkedArtifactCount: feature.linkedArtifactCount,
        percentWithPoints: feature.percentWithPoints,
        htmlUrl: apiService.buildTuleapUrl(feature.artifact.html_url, feature.artifact.id),
        children: []
      }

      // Add sub-artifacts (tasks/stories under features)
      feature.subArtifacts.forEach(subArtifact => {
        const subNode: TreeNode = {
          id: `sub-${subArtifact.id}`,
          title: subArtifact.title,
          type: subArtifact.tracker.label.toLowerCase().includes('task') ? 'task' : 'story',
          artifact: subArtifact,
          status: subArtifact.status,
          points: apiService.extractPoints(subArtifact),
          remainingEffort: apiService.extractRemainingEffort(subArtifact),
          sprint: apiService.extractSprintInfo(subArtifact),
          htmlUrl: apiService.buildTuleapUrl(subArtifact.html_url, subArtifact.id)
        }
        featureNode.children!.push(subNode)
      })

      epicNode.children!.push(featureNode)
    })

    // Add direct stories (not under features)
    epicTreeData.directStories.forEach(story => {
      const storyNode: TreeNode = {
        id: `story-${story.id}`,
        title: story.title,
        type: 'story',
        artifact: story,
        status: story.status,
        points: apiService.extractPoints(story),
        remainingEffort: apiService.extractRemainingEffort(story),
        sprint: apiService.extractSprintInfo(story),
        htmlUrl: apiService.buildTuleapUrl(story.html_url, story.id)
      }
      epicNode.children!.push(storyNode)
    })

    // Add direct tasks (not under features)
    epicTreeData.directTasks.forEach(task => {
      const taskNode: TreeNode = {
        id: `task-${task.id}`,
        title: task.title,
        type: 'task',
        artifact: task,
        status: task.status,
        points: apiService.extractPoints(task),
        remainingEffort: apiService.extractRemainingEffort(task),
        sprint: apiService.extractSprintInfo(task),
        htmlUrl: apiService.buildTuleapUrl(task.html_url, task.id)
      }
      epicNode.children!.push(taskNode)
    })

    // Add defects
    epicTreeData.defects.forEach(defect => {
      const defectNode: TreeNode = {
        id: `defect-${defect.id}`,
        title: defect.title,
        type: 'defect',
        artifact: defect,
        status: defect.status,
        points: apiService.extractPoints(defect),
        remainingEffort: apiService.extractRemainingEffort(defect),
        sprint: apiService.extractSprintInfo(defect),
        htmlUrl: apiService.buildTuleapUrl(defect.html_url, defect.id)
      }
      epicNode.children!.push(defectNode)
    })

    treeData.value = [epicNode]
    
    // Auto-expand first level
    openNodes.value = ['epic', ...epicNode.children!.map(child => child.id)]
    
  } catch (err: unknown) {
    error.value = (err as Error).message || 'Failed to load tree data'
    console.error('Error loading tree data:', err)
  } finally {
    loading.value = false
  }
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'epic': return 'mdi-mountain'
    case 'feature': return 'mdi-puzzle-outline'
    case 'story': return 'mdi-book-open-variant'
    case 'task': return 'mdi-clipboard-list'
    case 'defect': return 'mdi-bug'
    default: return 'mdi-file-document'
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case 'epic': return 'purple'
    case 'feature': return 'primary'
    case 'story': return 'success'
    case 'task': return 'info'
    case 'defect': return 'error'
    default: return 'grey'
  }
}

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'done': return 'success'
    case 'development in progress': return 'warning'
    case 'to do': return 'info'
    case 'cancelled': return 'error'
    default: return 'grey'
  }
}


onMounted(() => {
  loadTreeData()
})
</script>

<template>
  <v-card elevation="2">
    <v-card-title class="d-flex align-center">
      <v-icon :icon="getTypeIcon('epic')" :color="getTypeColor('epic')" class="mr-2" />
      Epic Artifacts Tree
    </v-card-title>

    <v-card-text>
      <!-- Loading state -->
      <div v-if="loading" class="text-center py-8">
        <v-progress-circular indeterminate size="48" color="primary" />
        <div class="mt-4">Loading epic tree data...</div>
      </div>

      <!-- Error state -->
      <v-alert
        v-else-if="error"
        type="error"
        variant="tonal"
        class="mb-4"
      >
        {{ error }}
      </v-alert>

      <!-- Tree view -->
      <v-treeview
        v-else
        :items="treeData"
        :open="openNodes"
        item-key="id"
        item-title="title"
        item-children="children"
        open-strategy="multiple"
        class="epic-tree"
      >
        <template #prepend="{ item }">
          <v-icon
            :icon="getTypeIcon(item.type)"
            :color="getTypeColor(item.type)"
            size="small"
          />
        </template>

        <template #label="{ item }">
          <div class="d-flex align-center flex-wrap ga-2">
            <span class="font-weight-medium">{{ item.title }}</span>
            
            <!-- Status chip -->
            <v-chip
              v-if="item.status"
              :color="getStatusColor(item.status)"
              variant="tonal"
              size="x-small"
            >
              {{ item.status }}
            </v-chip>

            <!-- Points chip -->
            <v-chip
              v-if="item.points"
              color="info"
              variant="tonal"
              size="x-small"
            >
              {{ item.points }} pts
            </v-chip>

            <!-- Remaining effort chip -->
            <v-chip
              v-if="item.remainingEffort"
              color="warning"
              variant="tonal"
              size="x-small"
            >
              {{ item.remainingEffort }} remaining
            </v-chip>

            <!-- Sprint chip for stories/tasks -->
            <v-chip
              v-if="item.sprint && (item.type === 'story' || item.type === 'task')"
              color="secondary"
              variant="tonal"
              size="x-small"
            >
              {{ item.sprint }}
            </v-chip>

            <!-- Feature metrics -->
            <template v-if="item.type === 'feature'">
              <v-chip
                v-if="item.linkedArtifactCount"
                color="primary"
                variant="tonal"
                size="x-small"
              >
                {{ item.linkedArtifactCount }} linked
              </v-chip>
              <v-chip
                v-if="item.percentWithPoints !== undefined"
                :color="item.percentWithPoints === 100 ? 'success' : item.percentWithPoints > 50 ? 'warning' : 'error'"
                variant="tonal"
                size="x-small"
              >
                {{ item.percentWithPoints }}% estimated
              </v-chip>
            </template>

            <!-- Action button -->
            <v-btn
              v-if="item.htmlUrl"
              :href="item.htmlUrl"
              target="_blank"
              variant="text"
              size="x-small"
              icon="mdi-open-in-new"
              :color="getTypeColor(item.type)"
            />
          </div>
        </template>
      </v-treeview>

      <!-- Empty state -->
      <div v-if="!loading && !error && treeData.length === 0" class="text-center py-8">
        <v-icon icon="mdi-file-tree-outline" size="64" color="grey" />
        <div class="mt-4 text-h6">No artifacts found</div>
        <div class="text-body-2 text-grey">This epic has no linked artifacts.</div>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.epic-tree {
  margin: 0 -16px;
}

.epic-tree :deep(.v-treeview-item) {
  margin-bottom: 8px;
}

.epic-tree :deep(.v-treeview-item__content) {
  padding: 8px 16px;
}

.epic-tree :deep(.v-treeview-item__label) {
  flex: 1;
}

@media (max-width: 599px) {
  .epic-tree :deep(.v-treeview-item__content) {
    padding: 6px 12px;
  }
}
</style>