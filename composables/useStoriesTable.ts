import type { Epic, TuleapArtifact } from '@/types/api'
import { apiService } from '@/services/api'

// Cache for last points modification dates to avoid repeated API calls
const pointsModificationCache = new Map<number, string | null>()

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
  const flattenEpicTreeData = async (epics: Epic[]): Promise<TableRow[]> => {
    const rows: TableRow[] = []

    for (const epic of epics) {
      try {
        // Get the epic tree data
        const treeData = await apiService.getEpicTreeData(epic)
        
        
        // Process features and their sub-artifacts
        for (const feature of treeData.features) {
          // Add sub-artifacts (stories and tasks under features)
          for (const subArtifact of feature.subArtifacts) {
            const row = await createTableRow(subArtifact, feature.artifact.id, epic.id)
            rows.push(row)
          }
        }
        
        // Process direct stories (stories directly linked to epic)
        for (const story of treeData.directStories) {
          const row = await createTableRow(story, epic.id, epic.id)
          rows.push(row)
        }
        
        // Process direct tasks (tasks directly linked to epic)
        for (const task of treeData.directTasks) {
          const row = await createTableRow(task, epic.id, epic.id)
          rows.push(row)
        }
        
        // Process direct defects (defects directly linked to epic)
        for (const defect of treeData.defects) {
          const row = await createTableRow(defect, epic.id, epic.id)
          rows.push(row)
        }
      } catch (error) {
        console.error(`Error processing epic ${epic.id}:`, error)
      }
    }

    return rows
  }

  const createTableRow = async (artifact: TuleapArtifact, parentId: number, epicId: number): Promise<TableRow> => {
    const trackerLabel = artifact.tracker.label.toLowerCase()
    
    // Enhanced type classification logic
    let type: 'story' | 'task' | 'defect' = 'task' // default to task
    
    if (trackerLabel.includes('story') || trackerLabel.includes('stories')) {
      type = 'story'
    } else if (trackerLabel.includes('defect') || trackerLabel.includes('bug') || trackerLabel.includes('issue')) {
      type = 'defect'
    }
    
    // Initialize with loading state - will be processed in background
    const lastPointsModified: string | null = 'loading'
    
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
      lastPointsModified
    }
  }

  return {
    flattenEpicTreeData
  }
}