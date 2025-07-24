import type { Epic, TuleapArtifact } from '@/types/api'
import { apiService } from '@/services/api'

// Cache for last points modification dates to avoid repeated API calls
const pointsModificationCache = new Map<number, string | null>()

// Concurrency control for changeset fetching
const MAX_CONCURRENT_REQUESTS = 3
const REQUEST_TIMEOUT_MS = 10000

// Table row interface
export interface TableRow {
  id: number
  parentId: number | null
  epicId: number
  title: string
  status: string
  points: number | null
  sprint: string | null
  type: 'story' | 'task' | 'defect'
  htmlUrl: string
  lastPointsModified: string | null | 'loading' | 'error'
}

export const useStoriesTable = () => {
  // Helper function to fetch changeset data with caching and timeout
  const fetchLastPointsModification = async (artifactId: number): Promise<string | null> => {
    // Check cache first
    if (pointsModificationCache.has(artifactId)) {
      return pointsModificationCache.get(artifactId)!
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
      pointsModificationCache.set(artifactId, lastModified)
      
      return lastModified
    } catch (error) {
      console.error(`Failed to fetch changesets for artifact ${artifactId}:`, error)
      // Cache null result to avoid repeated failures
      pointsModificationCache.set(artifactId, null)
      return null
    }
  }

  const flattenEpicTreeData = async (epics: Epic[]): Promise<TableRow[]> => {
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

    // Third pass: fetch all changesets concurrently with controlled concurrency
    console.log(`🚀 Fetching changesets for ${rows.length} artifacts...`)
    await fetchChangesetsForRows(rows)

    return rows
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
    
    return {
      id: artifact.id,
      parentId,
      epicId,
      title: artifact.title,
      status: artifact.status,
      points: apiService.extractPoints(artifact),
      sprint: await apiService.extractSprintInfo(artifact),
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


  return {
    flattenEpicTreeData
  }
}