<template>
  <div>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="pa-6">
          <v-card-title class="text-center">
            <v-icon size="48" color="primary" class="mb-2">mdi-check-circle</v-icon>
            <h1 class="text-h4">Test View</h1>
          </v-card-title>
          
          <v-card-text class="text-center">
            <p class="text-h6 mb-4">This is a simple test view to verify the app is working.</p>
            
            <v-card variant="outlined" class="pa-4">
              <v-card-title class="text-h6">
                <v-icon class="mr-2">mdi-clock</v-icon>
                Current Time
              </v-card-title>
              <v-card-text>
                <p class="text-h5 text-primary">{{ currentTime }}</p>
              </v-card-text>
              <v-card-actions class="justify-center">
                <v-btn 
                  @click="updateTime" 
                  color="primary" 
                  variant="elevated"
                  size="large"
                >
                  <v-icon start>mdi-refresh</v-icon>
                  Update Time
                </v-btn>
              </v-card-actions>
            </v-card>
            
            <v-card variant="outlined" class="pa-4 mt-4">
              <v-card-title class="text-h6">
                <v-icon class="mr-2">mdi-palette</v-icon>
                Icon Test
              </v-card-title>
              <v-card-text>
                <p class="mb-2">Testing various MDI icons:</p>
                <div class="d-flex flex-wrap gap-2">
                  <v-chip color="primary" variant="tonal">
                    <v-icon start>mdi-check</v-icon>
                    Success
                  </v-chip>
                  <v-chip color="warning" variant="tonal">
                    <v-icon start>mdi-clock</v-icon>
                    Progress
                  </v-chip>
                  <v-chip color="info" variant="tonal">
                    <v-icon start>mdi-information-outline</v-icon>
                    Info
                  </v-chip>
                  <v-chip color="error" variant="tonal">
                    <v-icon start>mdi-alert</v-icon>
                    Error
                  </v-chip>
                </div>
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const currentTime = ref<string>('')

const updateTime = () => {
  currentTime.value = new Date().toLocaleTimeString()
}

onMounted(() => {
  updateTime()
})
</script>

