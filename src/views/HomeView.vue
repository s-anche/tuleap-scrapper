<script setup lang="ts">
import { ref } from 'vue'
import ProjectList from '@/components/ProjectList.vue'
import TrackerList from '@/components/TrackerList.vue'
import ArtifactList from '@/components/ArtifactList.vue'
import type { Project, Tracker, Artifact, ArtifactType } from '@/types/api'

const selectedProject = ref<Project | null>(null)
const selectedTracker = ref<Tracker | null>(null)
const selectedArtifact = ref<Artifact | null>(null)
const selectedArtifactType = ref<ArtifactType>('epic' as ArtifactType)

const artifactTypes = [
  { value: 'epic', label: 'Epics' },
  { value: 'feature', label: 'Features' },
  { value: 'task', label: 'Tasks' },
  { value: 'story', label: 'Stories' }
]

const onProjectSelected = (project: Project) => {
  selectedProject.value = project
  selectedTracker.value = null
  selectedArtifact.value = null
}

const onTrackerSelected = (tracker: Tracker) => {
  selectedTracker.value = tracker
  selectedArtifact.value = null
}

const onArtifactSelected = (artifact: Artifact) => {
  selectedArtifact.value = artifact
}

const onArtifactTypeChanged = () => {
  selectedArtifact.value = null
}
</script>

<template>
  <div>
    <v-row class="mb-8">
      <v-col cols="12" class="text-center">
        <h1 class="text-h2 text-primary font-weight-light mb-3">Tuleap Tracker Dashboard</h1>
        <p class="text-h5 text-medium-emphasis">Select a project to view its trackers and artifacts</p>
      </v-col>
    </v-row>

    <!-- Projects Section -->
    <v-row>
      <v-col cols="12">
        <ProjectList @project-selected="onProjectSelected" />
      </v-col>
    </v-row>

    <!-- Trackers Section -->
    <v-row v-if="selectedProject">
      <v-col cols="12">
        <TrackerList 
          :project-id="selectedProject.id" 
          @tracker-selected="onTrackerSelected"
        />
      </v-col>
    </v-row>

    <!-- Artifacts Section -->
    <v-row v-if="selectedTracker">
      <v-col cols="12">
        <v-card class="pa-6">
          <v-card-title class="d-flex align-center pa-6">
            <v-icon class="mr-3" size="large">mdi-format-list-bulleted</v-icon>
            <span class="text-h4">Artifacts</span>
            <v-spacer></v-spacer>
            <v-select
              v-model="selectedArtifactType"
              :items="artifactTypes"
              item-title="label"
              item-value="value"
              label="Artifact Type"
              variant="outlined"
              density="default"
              style="min-width: 250px"
              @update:model-value="onArtifactTypeChanged"
            />
          </v-card-title>
          <v-card-text class="pa-6">
            <ArtifactList 
              :tracker-id="selectedTracker.id"
              :artifact-type="selectedArtifactType"
              :title="artifactTypes.find(t => t.value === selectedArtifactType)?.label || 'Artifacts'"
              @artifact-selected="onArtifactSelected"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Artifact Details Section -->
    <v-row v-if="selectedArtifact">
      <v-col cols="12">
        <v-card class="pa-6">
          <v-card-title class="d-flex align-center pa-6">
            <v-icon class="mr-3" size="large">mdi-file-document</v-icon>
            <span class="text-h4">{{ selectedArtifact.title || `Artifact #${selectedArtifact.id}` }}</span>
          </v-card-title>
          <v-card-text class="pa-6">
            <v-row>
              <v-col cols="12" sm="6" md="4" lg="3" class="pa-3">
                <v-card variant="outlined" class="h-100">
                  <v-card-text class="pa-4">
                    <div class="text-overline mb-2">ID</div>
                    <div class="text-h5">{{ selectedArtifact.id }}</div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" sm="6" md="4" lg="3" class="pa-3">
                <v-card variant="outlined" class="h-100">
                  <v-card-text class="pa-4">
                    <div class="text-overline mb-2">Tracker</div>
                    <div class="text-h5">{{ selectedArtifact.tracker.label }}</div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" sm="6" md="4" lg="3" class="pa-3">
                <v-card variant="outlined" class="h-100">
                  <v-card-text class="pa-4">
                    <div class="text-overline mb-2">Project</div>
                    <div class="text-h5">{{ selectedArtifact.project.label }}</div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" sm="6" md="4" lg="3" class="pa-3">
                <v-card variant="outlined" class="h-100">
                  <v-card-text class="pa-4">
                    <div class="text-overline mb-2">Last Updated</div>
                    <div class="text-h5">{{ new Date(selectedArtifact.last_update_date).toLocaleDateString() }}</div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

