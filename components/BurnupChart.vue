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
          <div v-if="loading" class="text-center pa-8">
            <v-progress-circular indeterminate color="primary" />
            <p class="mt-2">Processing chart data...</p>
          </div>
          
          <div v-else-if="chartData.labels.length === 0" class="text-center pa-8">
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
                  <div class="d-flex align-center mb-1">
                    <div class="legend-color total-scope mr-2"></div>
                    <span class="text-body-2">Total Scope - Cumulative story points across sprints</span>
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
                    <div>Total Sprints: {{ chartData.labels.length }}</div>
                    <div>Points Calculation: Uses mean story points ({{ meanPoints.toFixed(1) }} pts) for items without explicit points</div>
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
import { ref, computed, watch } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions
} from 'chart.js'
import { useBurnupChart, type BurnupChartData } from '@/composables/useBurnupChart'
import type { TableRow } from '@/composables/useStoriesTable'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
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
const chartData = ref<BurnupChartData>({
  labels: [],
  datasets: []
})

// Chart options
const chartOptions = computed(() => getChartOptions() as ChartOptions<'line'>)

// Process chart data when filtered rows change
const processChartData = async () => {
  if (props.filteredRows.length === 0) {
    chartData.value = {
      labels: [],
      datasets: []
    }
    return
  }

  loading.value = true
  
  try {
    // Add a small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 100))
    
    chartData.value = processBurnupData(props.filteredRows, props.meanPoints)
  } catch (error) {
    console.error('Error processing chart data:', error)
    chartData.value = {
      labels: [],
      datasets: []
    }
  } finally {
    loading.value = false
  }
}

// Watch for changes in filtered rows or mean points
watch(
  () => [props.filteredRows, props.meanPoints],
  processChartData,
  { immediate: true, deep: true }
)
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

.legend-color.completed {
  background-color: #4CAF50;
}

/* Ensure chart is responsive */
.chart-container canvas {
  max-width: 100%;
  height: auto !important;
}
</style>