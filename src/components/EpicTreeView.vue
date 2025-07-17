<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
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

// Transform data for v-treeview if needed
const transformedTreeData = computed(() => {
  const transformNode = (node: TreeNode): TreeNode => ({
    ...node,
    children: node.children ? sortByStatus(node.children).map(transformNode) : []
  })
  
  return treeData.value.map(item => ({
    ...item,
    children: item.children ? sortByStatus(item.children).map(transformNode) : []
  }))
})

const loadTreeData = async () => {
  try {
    loading.value = true
    error.value = null
    
    console.log('=== EPIC TREE DEBUG START ===')
    console.log('Epic object:', props.epic)
    console.log('Epic links structure:', props.epic.links)
    console.log('Epic links features count:', props.epic.links?.features?.length || 0)
    console.log('Epic links stories count:', props.epic.links?.stories?.length || 0)
    console.log('Epic links tasks count:', props.epic.links?.tasks?.length || 0)
    console.log('Epic links defects count:', props.epic.links?.defects?.length || 0)
    
    const epicTreeData = await apiService.getEpicTreeData(props.epic)
    console.log('Epic tree data received:', epicTreeData)
    console.log('Features in tree data:', epicTreeData.features?.length || 0)
    console.log('Direct stories in tree data:', epicTreeData.directStories?.length || 0)
    console.log('Direct tasks in tree data:', epicTreeData.directTasks?.length || 0)
    console.log('Defects in tree data:', epicTreeData.defects?.length || 0)
    
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
    
    console.log('Built epic node:', epicNode)
    console.log('Epic node children count:', epicNode.children?.length || 0)
    console.log('Epic node children:', epicNode.children)
    
    // Auto-expand first level
    openNodes.value = ['epic', ...epicNode.children!.map(child => child.id)]
    console.log('Open nodes:', openNodes.value)
    console.log('Open nodes type:', typeof openNodes.value)
    console.log('Open nodes is array:', Array.isArray(openNodes.value))
    console.log('=== EPIC TREE DEBUG END ===')
    
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
    case 'implementation in progress': return 'warning'
    case 'implemented': return 'primary'
    case 'to do': return 'info'
    case 'new': return 'info'
    case 'ready': return 'info'
    case 'cancelled': return 'error'
    case 'merged': return 'success'
    case 'done without dev': return 'success'
    default: return 'grey'
  }
}

const getStatusPriority = (status: string): number => {
  switch (status?.toLowerCase()) {
    case 'new': return 1
    case 'to do': return 2
    case 'ready': return 3
    case 'implementation in progress': return 4
    case 'development in progress': return 4
    case 'implemented': return 5
    case 'done': return 6
    case 'done without dev': return 6
    case 'merged': return 6
    case 'cancelled': return 7
    default: return 8
  }
}

const sortByStatus = (items: TreeNode[]): TreeNode[] => {
  return [...items].sort((a, b) => {
    const priorityA = getStatusPriority(a.status || '')
    const priorityB = getStatusPriority(b.status || '')
    return priorityA - priorityB
  })
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
      <div v-else>
        <!-- Tree view debugging -->
        <div class="mb-4">
          <h4>V-Treeview Debug:</h4>
          <p>Items count: {{ transformedTreeData.length }}</p>
          <p>First item: {{ transformedTreeData[0]?.id }} - {{ transformedTreeData[0]?.title }}</p>
          <p>First item children: {{ transformedTreeData[0]?.children?.length }}</p>
        </div>
        
        <!-- Simple v-treeview test -->
        <v-treeview
          :items="transformedTreeData"
          item-key="id"
          item-title="title"
          item-children="children"
          open-all
          class="epic-tree"
        />
        
        <!-- Alternative: Custom nested tree with features and sub-artifacts -->
        <div class="mt-4">
          <h4>Epic Artifacts Tree:</h4>
          <v-expansion-panels multiple variant="accordion">
            <v-expansion-panel
              v-for="item in transformedTreeData"
              :key="item.id"
              :title="item.title"
            >
              <v-expansion-panel-text>
                <v-list v-if="item.children && item.children.length > 0">
                  <!-- Features with their sub-artifacts -->
                  <template v-for="child in item.children" :key="child.id">
                    <!-- Feature item -->
                    <v-list-item
                      v-if="child.type === 'feature'"
                      :prepend-icon="getTypeIcon(child.type)"
                      :href="child.htmlUrl"
                      target="_blank"
                      class="feature-item"
                    >
                      <v-list-item-title class="font-weight-medium">
                        {{ child.title }}
                        <v-chip
                          v-if="child.linkedArtifactCount"
                          size="x-small"
                          variant="tonal"
                          color="info"
                          class="ml-2"
                        >
                          {{ child.linkedArtifactCount }} items
                        </v-chip>
                      </v-list-item-title>
                      <template #append>
                        <v-chip
                          v-if="child.status"
                          :color="getStatusColor(child.status)"
                          size="x-small"
                          variant="tonal"
                        >
                          {{ child.status }}
                        </v-chip>
                      </template>
                    </v-list-item>
                    
                    <!-- Sub-artifacts under features -->
                    <v-list v-if="child.children && child.children.length > 0" class="ml-8">
                      <v-list-item
                        v-for="subArtifact in child.children"
                        :key="subArtifact.id"
                        :prepend-icon="getTypeIcon(subArtifact.type)"
                        :href="subArtifact.htmlUrl"
                        target="_blank"
                        class="sub-artifact-item"
                        density="compact"
                      >
                        <v-list-item-title class="text-body-2">
                          {{ subArtifact.title }}
                        </v-list-item-title>
                        <template #append>
                          <div class="d-flex align-center ga-2">
                            <v-chip
                              v-if="subArtifact.points"
                              size="x-small"
                              variant="tonal"
                              color="primary"
                            >
                              {{ subArtifact.points }}pts
                            </v-chip>
                            <v-chip
                              v-if="subArtifact.status"
                              :color="getStatusColor(subArtifact.status)"
                              size="x-small"
                              variant="tonal"
                            >
                              {{ subArtifact.status }}
                            </v-chip>
                          </div>
                        </template>
                      </v-list-item>
                    </v-list>
                    
                    <!-- Direct stories/tasks (not under features) -->
                    <v-list-item
                      v-if="child.type !== 'feature'"
                      :prepend-icon="getTypeIcon(child.type)"
                      :href="child.htmlUrl"
                      target="_blank"
                      class="direct-item"
                    >
                      <v-list-item-title>{{ child.title }}</v-list-item-title>
                      <template #append>
                        <div class="d-flex align-center ga-2">
                          <v-chip
                            v-if="child.points"
                            size="x-small"
                            variant="tonal"
                            color="primary"
                          >
                            {{ child.points }}pts
                          </v-chip>
                          <v-chip
                            v-if="child.status"
                            :color="getStatusColor(child.status)"
                            size="x-small"
                            variant="tonal"
                          >
                            {{ child.status }}
                          </v-chip>
                        </div>
                      </template>
                    </v-list-item>
                  </template>
                </v-list>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
        
        <!-- Fallback manual list for debugging -->
        <div class="mt-4">
          <h4>Manual Children List (Debug):</h4>
          <v-list v-if="treeData[0]?.children?.length > 0">
            <v-list-item
              v-for="child in treeData[0].children"
              :key="child.id"
              :prepend-icon="getTypeIcon(child.type)"
            >
              <v-list-item-title>{{ child.title }}</v-list-item-title>
              <template #append>
                <v-chip
                  v-if="child.status"
                  :color="getStatusColor(child.status)"
                  size="x-small"
                  variant="tonal"
                >
                  {{ child.status }}
                </v-chip>
              </template>
            </v-list-item>
          </v-list>
        </div>
      </div>
      
      <!-- Debug info -->
      <div v-if="treeData.length > 0" class="mt-4 pa-4" style="background: #f5f5f5; border-radius: 8px;">
        <h4>Debug Info:</h4>
        <p>Tree data items: {{ treeData.length }}</p>
        <p>Children in first item: {{ treeData[0]?.children?.length || 0 }}</p>
        <p>Open nodes: {{ openNodes.length }}</p>
        <p>First child ID: {{ treeData[0]?.children?.[0]?.id }}</p>
        <p>First child title: {{ treeData[0]?.children?.[0]?.title }}</p>
        <details>
          <summary>Raw tree data (first 3 children)</summary>
          <pre>{{ JSON.stringify(treeData[0]?.children?.slice(0, 3), null, 2) }}</pre>
        </details>
      </div>

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

/* Custom tree styling */
.feature-item {
  background: rgba(var(--v-theme-primary), 0.05);
  border-left: 3px solid rgb(var(--v-theme-primary));
  margin-bottom: 8px;
}

.sub-artifact-item {
  background: rgba(var(--v-theme-surface), 0.5);
  border-left: 2px solid rgba(var(--v-theme-primary), 0.3);
  margin-bottom: 2px;
}

.direct-item {
  background: rgba(var(--v-theme-success), 0.05);
  border-left: 3px solid rgb(var(--v-theme-success));
  margin-bottom: 4px;
}
</style>