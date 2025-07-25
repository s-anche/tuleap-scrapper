import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiService } from '@/services/api'
import type { Epic, TuleapArtifact } from '@/types/api'

const STORAGE_KEY = 'stories_table_data'
const CACHE_EXPIRY_HOURS = 24

// Table row interface
export interface TableRow {
  id: number
  parentId: number | null
  epicId: number
  title: string
  status: string
  points: number | null
  sprint: string | null
  team: string
  type: 'story' | 'task' | 'defect'
  htmlUrl: string
  lastPointsModified: string | null | 'loading' | 'error'
}

interface StoredTableData {
  epicIdsKey: string
  tableRows: TableRow[]
  pointsModificationCache: Record<number, string | null>
  timestamp: number
}

// Concurrency control for changeset fetching
const MAX_CONCURRENT_REQUESTS = 3
const REQUEST_TIMEOUT_MS = 10000

export const useStoriesTableStore = defineStore('storiesTable', () => {
  const tableRows = ref<TableRow[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const isHydrated = ref(false)
  const currentEpicIdsKey = ref<string>('')
  
  // In-memory cache for points modification data
  const pointsModificationCache = ref<Map<number, string | null>>(new Map())

  // Computed properties
  const hasData = computed(() => tableRows.value.length > 0)
  const isLoading = computed(() => loading.value)

  // Generate cache key from epic IDs
  const generateEpicIdsKey = (epics: Epic[]): string => {
    return epics
      .map(epic => epic.id)
      .sort((a, b) => a - b)
      .join(',')
  }

  // Check if cache is still valid
  const isCacheValid = (timestamp: number): boolean => {
    const now = Date.now()
    const maxAge = CACHE_EXPIRY_HOURS * 60 * 60 * 1000
    return (now - timestamp) < maxAge
  }

  // Load data from localStorage
  const loadFromStorage = (epicIdsKey: string): boolean => {
    if (!process.client) return false
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data: StoredTableData = JSON.parse(stored)
        
        // Check if the cache matches the requested epic IDs and is still valid
        if (data.epicIdsKey === epicIdsKey && isCacheValid(data.timestamp)) {
          tableRows.value = data.tableRows
          currentEpicIdsKey.value = data.epicIdsKey
          
          // Restore points modification cache
          pointsModificationCache.value = new Map(Object.entries(data.pointsModificationCache))
          
          console.log(`📦 Loaded ${data.tableRows.length} table rows from cache`)
          return true
        } else {
          console.log('🔄 Cache expired or epic IDs changed, will refresh data')
        }
      }
    } catch (error) {
      console.error('Error loading stories table data from localStorage:', error)
    }
    return false
  }

  // Save data to localStorage
  const saveToStorage = () => {
    if (!process.client) return
    
    try {
      const data: StoredTableData = {
        epicIdsKey: currentEpicIdsKey.value,
        tableRows: tableRows.value,
        pointsModificationCache: Object.fromEntries(pointsModificationCache.value),
        timestamp: Date.now()
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      console.log(`💾 Saved ${data.tableRows.length} table rows to cache`)
    } catch (error) {
      console.error('Error saving stories table data to localStorage:', error)
    }
  }

  // Helper function to fetch changeset data with caching and timeout
  const fetchLastPointsModification = async (artifactId: number): Promise<string | null> => {
    // Check cache first
    if (pointsModificationCache.value.has(artifactId)) {
      return pointsModificationCache.value.get(artifactId)!
    }

    try {
      // Create timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), REQUEST_TIMEOUT_MS)
      })

      // Fetch changesets with timeout
      const changesetsPromise = apiService.getArtifactChangesets(artifactId)
      const changesets = await Promise.race([changesetsPromise, timeoutPromise])
      
      // Find last points modification
      const lastModified = apiService.findLastPointsModification(changesets)
      
      // Cache the result
      pointsModificationCache.value.set(artifactId, lastModified)
      
      return lastModified
    } catch (error) {
      console.error(`Failed to fetch changesets for artifact ${artifactId}:`, error)
      // Cache null result to avoid repeated failures
      pointsModificationCache.value.set(artifactId, null)
      return null
    }
  }

  // Create table row without changesets (for initial loading)
  const createTableRowWithoutChangesets = async (artifact: TuleapArtifact, parentId: number, epicId: number): Promise<TableRow> => {
    const trackerLabel = artifact.tracker.label.toLowerCase()
    
    // Enhanced type classification logic
    let type: 'story' | 'task' | 'defect' = 'task' // default to task
    
    if (trackerLabel.includes('story') || trackerLabel.includes('stories')) {
      type = 'story'
    } else if (trackerLabel.includes('defect') || trackerLabel.includes('bug') || trackerLabel.includes('issue')) {
      type = 'defect'
    }
    
    // Extract team name from tracker.project.label
    const team = artifact.tracker?.project?.label || 'Unknown Team'
    
    return {
      id: artifact.id,
      parentId,
      epicId,
      title: artifact.title,
      status: artifact.status,
      points: apiService.extractPoints(artifact),
      sprint: await apiService.extractSprintInfo(artifact),
      team,
      type,
      htmlUrl: apiService.buildTuleapUrl(artifact.html_url, artifact.id),
      lastPointsModified: 'loading' // Will be updated in fetchChangesetsForRows
    }
  }

  // Fetch changesets for all rows with controlled concurrency
  const fetchChangesetsForRows = async (rows: TableRow[]): Promise<void> => {
    let activeRequests = 0
    let processedCount = 0
    let failedCount = 0

    const processRow = async (row: TableRow): Promise<void> => {
      try {
        activeRequests++
        const lastModified = await fetchLastPointsModification(row.id)
        row.lastPointsModified = lastModified
        processedCount++
      } catch (error) {
        console.error(`Failed to process changeset for artifact ${row.id}:`, error)
        row.lastPointsModified = null
        failedCount++
      } finally {
        activeRequests--
      }
    }

    // Process all rows with concurrency control
    const promises: Promise<void>[] = []
    
    for (const row of rows) {
      // Wait if we've hit the concurrency limit
      while (activeRequests >= MAX_CONCURRENT_REQUESTS) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      const promise = processRow(row)
      promises.push(promise)
    }

    // Wait for all requests to complete
    await Promise.allSettled(promises)
    
    console.log(`✅ Changeset processing complete: ${processedCount} successful, ${failedCount} failed`)
  }

  // Main function to load/process table data from epics
  const loadTableData = async (epics: Epic[]): Promise<void> => {
    if (epics.length === 0) {
      tableRows.value = []
      currentEpicIdsKey.value = ''
      return
    }

    const epicIdsKey = generateEpicIdsKey(epics)
    
    // Try to load from cache first
    if (loadFromStorage(epicIdsKey)) {
      return
    }

    // If cache miss, process the data
    loading.value = true
    error.value = null
    currentEpicIdsKey.value = epicIdsKey

    try {
      console.log(`🔄 Processing ${epics.length} epics for table data...`)
      
      const rows: TableRow[] = []
      const artifactsToProcess: Array<{ artifact: TuleapArtifact, parentId: number, epicId: number }> = []

      // First pass: collect all artifacts and create table rows without changesets
      for (const epic of epics) {
        try {
          // Get the epic tree data
          const treeData = await apiService.getEpicTreeData(epic)
          
          // Collect features and their sub-artifacts
          for (const feature of treeData.features) {
            for (const subArtifact of feature.subArtifacts) {
              artifactsToProcess.push({ artifact: subArtifact, parentId: feature.artifact.id, epicId: epic.id })
            }
          }
          
          // Collect direct stories
          for (const story of treeData.directStories) {
            artifactsToProcess.push({ artifact: story, parentId: epic.id, epicId: epic.id })
          }
          
          // Collect direct tasks
          for (const task of treeData.directTasks) {
            artifactsToProcess.push({ artifact: task, parentId: epic.id, epicId: epic.id })
          }
          
          // Collect direct defects
          for (const defect of treeData.defects) {
            artifactsToProcess.push({ artifact: defect, parentId: epic.id, epicId: epic.id })
          }
        } catch (error) {
          console.error(`Error processing epic ${epic.id}:`, error)
        }
      }

      // Second pass: create table rows with sprint info (no changesets yet)
      console.log(`🔄 Processing ${artifactsToProcess.length} artifacts for basic data...`)
      for (const { artifact, parentId, epicId } of artifactsToProcess) {
        const row = await createTableRowWithoutChangesets(artifact, parentId, epicId)
        rows.push(row)
      }

      // Update store with initial data
      tableRows.value = rows

      // Third pass: fetch all changesets concurrently with controlled concurrency
      console.log(`🚀 Fetching changesets for ${rows.length} artifacts...`)
      await fetchChangesetsForRows(rows)

      // Save to cache after successful processing
      saveToStorage()

    } catch (err) {
      error.value = 'Failed to load table data'
      console.error('Error loading table data:', err)
      tableRows.value = []
    } finally {
      loading.value = false
    }
  }

  // Clear all data
  const clearTableData = () => {
    tableRows.value = []
    currentEpicIdsKey.value = ''
    pointsModificationCache.value.clear()
    error.value = null
    
    // Clear from localStorage
    if (process.client) {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  // Hydrate store from localStorage on app initialization
  const hydrate = () => {
    if (process.client && !isHydrated.value) {
      // Try to load any existing cache (without specific epic IDs requirement)
      // This will only succeed if the cache is valid and matches current epics
      isHydrated.value = true
    }
  }

  return {
    // State
    tableRows: computed(() => tableRows.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    isHydrated: computed(() => isHydrated.value),
    currentEpicIdsKey: computed(() => currentEpicIdsKey.value),
    
    // Computed
    hasData,
    isLoading,
    
    // Actions
    loadTableData,
    clearTableData,
    hydrate,
    
    // Internal methods (exposed for testing/debugging)
    loadFromStorage,
    saveToStorage,
    generateEpicIdsKey
  }
})