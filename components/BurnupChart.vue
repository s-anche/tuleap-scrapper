<template>
  <v-card class="mb-4">
    <v-card-title class="d-flex align-center">
      <v-icon class="mr-2">mdi-chart-line</v-icon>
      Burnup Chart
      <v-spacer />
      <v-btn
        :icon="showChart ? 'mdi-chevron-up' : 'mdi-chevron-down'"
        variant="text"
        @click="showChart = !showChart"
      />
    </v-card-title>
    
    <v-expand-transition>
      <div v-show="showChart">
        <v-card-text>
          <!-- Filtering Controls -->
          <v-row class="mb-4">
            <v-col cols="12">
              <v-card variant="outlined" class="pa-3">
                <div class="text-subtitle-2 mb-2">Chart Filters</div>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-checkbox
                      v-model="includeCanceled"
                      label="Include canceled/rejected items"
                      density="compact"
                      hide-details
                      @change="processChartData"
                    >
                      <template #append>
                        <v-tooltip activator="parent" location="top">
                          <span>Include items with status like "canceled", "rejected", "abandoned" in scope calculations</span>
                        </v-tooltip>
                      </template>
                    </v-checkbox>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-checkbox
                      v-model="includeUnsized"
                      label="Use mean points for unsized items"
                      density="compact"
                      hide-details
                      @change="processChartData"
                    >
                      <template #append>
                        <v-tooltip activator="parent" location="top">
                          <span>Assign mean story points ({{ meanPoints.toFixed(1) }} pts) to items without explicit points, otherwise they count as 0 pts</span>
                        </v-tooltip>
                      </template>
                    </v-checkbox>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
          <div v-if="loading" class="text-center pa-8">
            <v-progress-circular indeterminate color="primary" />
            <p class="mt-2">Processing chart data...</p>
          </div>
          
          <div v-else-if="chartData.datasets.length === 0" class="text-center pa-8">
            <v-icon size="64" color="grey-lighten-2">mdi-chart-line-stacked</v-icon>
            <p class="text-h6 mt-2">No data available</p>
            <p class="text-body-2">No artifacts with sprints found to display in burnup chart.</p>
          </div>
          
          <div v-else class="chart-container">
            <Line
              :data="chartData"
              :options="chartOptions"
              :height="300"
            />
          </div>
          
          <v-row class="mt-4">
            <v-col cols="12" md="6">
              <v-card variant="outlined">
                <v-card-text>
                  <div class="text-subtitle-2 mb-2">Chart Legend</div>
                  <div v-if="chartData.hasEstimatedScope" class="d-flex align-center mb-1">
                    <div class="legend-color estimated-scope mr-2"></div>
                    <span class="text-body-2">Estimated Scope (Actual) - Points estimated during each sprint</span>
                  </div>
                  <div v-else class="d-flex align-center mb-1">
                    <v-progress-circular
                      indeterminate
                      color="orange"
                      size="16"
                      width="2"
                      class="mr-2"
                    />
                    <span class="text-body-2 text-grey">Estimated Scope - Loading estimation timeline...</span>
                  </div>
                  <div class="d-flex align-center">
                    <div class="legend-color completed mr-2"></div>
                    <span class="text-body-2">Completed - Cumulative completed story points</span>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" md="6">
              <v-card variant="outlined">
                <v-card-text>
                  <div class="text-subtitle-2 mb-2">Chart Info</div>
                  <div class="text-body-2">
                    <div>Data Points: {{ chartData.datasets.reduce((sum, dataset) => sum + dataset.data.length, 0) }}</div>
                    <div>
                      Points Calculation: 
                      <span v-if="includeUnsized">Uses mean story points ({{ meanPoints.toFixed(1) }} pts) for items without explicit points</span>
                      <span v-else>Unsized items count as 0 pts</span>
                    </div>
                    <div>
                      Items Included: 
                      <span v-if="includeCanceled">All items (including canceled/rejected)</span>
                      <span v-else>Active items only (canceled/rejected excluded)</span>
                    </div>
                    <div>Estimation Timeline: Based on actual dates when points were assigned/modified</div>
                    <div>Status: Items marked as "Done", "Closed", or "Completed" are considered finished</div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions
} from 'chart.js'
import 'chartjs-adapter-date-fns'
import { useBurnupChart, type BurnupChartData } from '@/composables/useBurnupChart'
import type { TableRow } from '@/composables/useStoriesTable'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

// Props
interface Props {
  filteredRows: TableRow[]
  meanPoints: number
}

const props = defineProps<Props>()

// Composables
const { processBurnupData, getChartOptions } = useBurnupChart()

// State
const showChart = ref(true)
const loading = ref(false)
const isMounted = ref(true)
const includeCanceled = ref(false)
const includeUnsized = ref(true)
const chartData = ref<BurnupChartData>({
  datasets: []
})

// Chart options
const chartOptions = computed(() => getChartOptions() as ChartOptions<'line'>)

// Process chart data when filtered rows change
const processChartData = async () => {
  // Prevent updates if component is unmounted
  if (!isMounted.value) return
  
  if (props.filteredRows.length === 0) {
    if (isMounted.value) {
      chartData.value = {
        datasets: []
      }
    }
    return
  }

  if (isMounted.value) {
    loading.value = true
  }
  
  try {
    // Add a small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Check again if component is still mounted after async operation
    if (!isMounted.value) return
    
    const newChartData = processBurnupData(props.filteredRows, props.meanPoints, {
      includeCanceled: includeCanceled.value,
      includeUnsized: includeUnsized.value
    })
    
    if (isMounted.value) {
      chartData.value = newChartData
    }
  } catch (error) {
    console.error('Error processing chart data:', error)
    if (isMounted.value) {
      chartData.value = {
        datasets: []
      }
    }
  } finally {
    if (isMounted.value) {
      loading.value = false
    }
  }
}

// Watch for changes in filtered rows or mean points
const stopWatcher = watch(
  () => [props.filteredRows, props.meanPoints],
  processChartData,
  { immediate: true, deep: true }
)

// Cleanup on unmount
onBeforeUnmount(() => {
  isMounted.value = false
  stopWatcher()
})
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 300px;
  width: 100%;
}

.legend-color {
  width: 16px;
  height: 3px;
  border-radius: 2px;
}

.legend-color.total-scope {
  background-color: #1976D2;
}

.legend-color.estimated-scope {
  background-color: #FF9800;
}

.legend-color.completed {
  background-color: #4CAF50;
}

/* Ensure chart is responsive */
.chart-container canvas {
  max-width: 100%;
  height: auto !important;
}
</style>