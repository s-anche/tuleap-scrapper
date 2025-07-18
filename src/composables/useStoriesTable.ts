import type { Epic, TuleapArtifact } from '@/types/api'
import { apiService } from '@/services/api'

// Table row interface
export interface TableRow {
  id: number
  parentId: number | null
  title: string
  status: string
  points: number | null
  sprint: string | null
  type: 'story' | 'task'
  htmlUrl: string
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
            const row = await createTableRow(subArtifact, feature.artifact.id)
            rows.push(row)
          }
        }
        
        // Process direct stories (stories directly linked to epic)
        for (const story of treeData.directStories) {
          const row = await createTableRow(story, epic.id)
          rows.push(row)
        }
        
        // Process direct tasks (tasks directly linked to epic)
        for (const task of treeData.directTasks) {
          const row = await createTableRow(task, epic.id)
          rows.push(row)
        }
      } catch (error) {
        console.error(`Error processing epic ${epic.id}:`, error)
      }
    }

    return rows
  }

  const createTableRow = async (artifact: TuleapArtifact, parentId: number): Promise<TableRow> => {
    const trackerLabel = artifact.tracker.label.toLowerCase()
    const type = trackerLabel.includes('story') ? 'story' : 'task'
    
    return {
      id: artifact.id,
      parentId,
      title: artifact.title,
      status: artifact.status,
      points: apiService.extractPoints(artifact),
      sprint: await apiService.extractSprintInfo(artifact),
      type,
      htmlUrl: artifact.html_url
    }
  }

  return {
    flattenEpicTreeData
  }
}