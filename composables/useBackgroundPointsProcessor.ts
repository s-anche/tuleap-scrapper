import { ref, reactive, readonly } from 'vue'
import { apiService } from '@/services/api'
import type { TableRow } from '@/stores/storiesTable'

interface ProcessingState {
  isEnabled: boolean
  isProcessing: boolean
  totalItems: number
  processedItems: number
  failedItems: number
  progress: number
}

// Global processing state
const processingState = reactive<ProcessingState>({
  isEnabled: true,
  isProcessing: false,
  totalItems: 0,
  processedItems: 0,
  failedItems: 0,
  progress: 0
})

// Cache for results with expiration
const CACHE_EXPIRY_HOURS = 24
interface CacheEntry {
  result: string | null
  timestamp: number
}

const pointsCache = new Map<number, CacheEntry>()

// Concurrency control
const MAX_CONCURRENT_REQUESTS = 3
const REQUEST_TIMEOUT_MS = 10000

export const useBackgroundPointsProcessor = () => {
  const processingQueue = ref<TableRow[]>([])
  const activeRequests = ref(0)

  // Check if cache entry is valid
  const isCacheValid = (entry: CacheEntry): boolean => {
    const now = Date.now()
    const expiryTime = entry.timestamp + (CACHE_EXPIRY_HOURS * 60 * 60 * 1000)
    return now < expiryTime
  }

  // Get cached result if valid
  const getCachedResult = (artifactId: number): string | null | undefined => {
    const entry = pointsCache.get(artifactId)
    if (entry && isCacheValid(entry)) {
      return entry.result
    }
    return undefined // Not cached or expired
  }

  // Cache result
  const setCachedResult = (artifactId: number, result: string | null) => {
    pointsCache.set(artifactId, {
      result,
      timestamp: Date.now()
    })
  }

  // Process a single artifact
  const processArtifact = async (row: TableRow): Promise<void> => {
    if (!processingState.isEnabled) return

    try {
      // Check cache first
      const cachedResult = getCachedResult(row.id)
      if (cachedResult !== undefined) {
        row.lastPointsModified = cachedResult
        processingState.processedItems++
        return
      }

      activeRequests.value++
      
      // Optimized changeset fetching with timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), REQUEST_TIMEOUT_MS)
      })

      const changesetsPromise = apiService.getArtifactChangesets(row.id)
      
      const changesets = await Promise.race([changesetsPromise, timeoutPromise])
      const lastModified = apiService.findLastPointsModification(changesets)
      
      row.lastPointsModified = lastModified
      setCachedResult(row.id, lastModified)
      processingState.processedItems++
      
    } catch (error) {
      console.error(`Failed to process artifact ${row.id}:`, error)
      row.lastPointsModified = 'error'
      setCachedResult(row.id, null)
      processingState.failedItems++
    } finally {
      activeRequests.value--
    }
  }

  // Process queue with concurrency limit
  const processQueue = async (): Promise<void> => {
    if (!processingState.isEnabled || processingState.isProcessing) return

    processingState.isProcessing = true
    processingState.processedItems = 0
    processingState.failedItems = 0
    processingState.totalItems = processingQueue.value.length

    console.log(`🚀 Starting background processing of ${processingState.totalItems} artifacts`)

    // Process items with concurrency limit
    const promises: Promise<void>[] = []
    
    for (const row of processingQueue.value) {
      // Wait if we've hit the concurrency limit
      while (activeRequests.value >= MAX_CONCURRENT_REQUESTS) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      const promise = processArtifact(row).finally(() => {
        processingState.progress = Math.round(
          (processingState.processedItems + processingState.failedItems) / processingState.totalItems * 100
        )
      })
      
      promises.push(promise)
    }

    await Promise.allSettled(promises)

    console.log(`✅ Background processing complete: ${processingState.processedItems} successful, ${processingState.failedItems} failed`)
    processingState.isProcessing = false
  }

  // Start processing for a set of rows
  const startProcessing = (rows: TableRow[]) => {
    console.log(`🎯 startProcessing called with ${rows.length} rows, enabled: ${processingState.isEnabled}`)
    
    if (!processingState.isEnabled) {
      console.log('❌ Processing disabled, skipping')
      return
    }

    // Debug: log the state of lastPointsModified for first few rows
    console.log('📊 Sample row states:', rows.slice(0, 3).map(row => ({
      id: row.id,
      lastPointsModified: row.lastPointsModified
    })))

    // Filter rows that need processing (loading state and not in cache)
    const rowsToProcess = rows.filter(row => {
      if (row.lastPointsModified !== 'loading') return false
      const cached = getCachedResult(row.id)
      return cached === undefined
    })

    console.log(`🔍 Found ${rowsToProcess.length} rows to process out of ${rows.length} total`)

    if (rowsToProcess.length === 0) {
      console.log('🎯 No artifacts need points processing')
      return
    }

    console.log(`🚀 Starting background processing for ${rowsToProcess.length} artifacts`)
    processingQueue.value = rowsToProcess
    processQueue()
  }

  // Toggle processing on/off
  const toggleProcessing = (enabled: boolean) => {
    processingState.isEnabled = enabled
    if (process.client) {
      localStorage.setItem('pointsProcessingEnabled', enabled.toString())
    }
  }

  // Initialize from localStorage
  const initializeSettings = () => {
    if (process.client) {
      const stored = localStorage.getItem('pointsProcessingEnabled')
      if (stored !== null) {
        processingState.isEnabled = stored === 'true'
      }
    }
  }

  return {
    processingState: readonly(processingState),
    startProcessing,
    toggleProcessing,
    initializeSettings
  }
}