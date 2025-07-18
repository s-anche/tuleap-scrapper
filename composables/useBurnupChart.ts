import type { TableRow } from '@/composables/useStoriesTable'

export interface BurnupChartData {
  labels: string[]
  datasets: Array<{
    label: string
    data: number[]
    borderColor: string
    backgroundColor: string
    tension: number
    fill: boolean
  }>
}

export interface SprintData {
  sprintName: string
  totalScope: number
  completedScope: number
  totalItems: number
  completedItems: number
}

export const useBurnupChart = () => {
  const isDoneStatus = (status: string): boolean => {
    const statusLower = status.toLowerCase()
    return statusLower.includes('done') || 
           statusLower.includes('closed') || 
           statusLower.includes('completed')
  }

  const getArtifactPoints = (artifact: TableRow, meanPoints: number): number => {
    // Use actual points if available, otherwise use mean story points
    return artifact.points ?? meanPoints
  }

  const sortSprints = (sprints: string[]): string[] => {
    // Separate sprints with no name and named sprints
    const namedSprints = sprints.filter(sprint => sprint !== 'No Sprint')
    const noSprint = sprints.filter(sprint => sprint === 'No Sprint')
    
    // Sort named sprints alphabetically (this handles alphanumeric sorting)
    namedSprints.sort((a, b) => {
      // Extract numeric parts for better sorting if they exist
      const aMatch = a.match(/(\d+)\.(\d+)/)
      const bMatch = b.match(/(\d+)\.(\d+)/)
      
      if (aMatch && bMatch) {
        const aMajor = parseInt(aMatch[1])
        const bMajor = parseInt(bMatch[1])
        const aMinor = parseInt(aMatch[2])
        const bMinor = parseInt(bMatch[2])
        
        if (aMajor !== bMajor) {
          return aMajor - bMajor
        }
        return aMinor - bMinor
      }
      
      // Fallback to alphabetical sorting
      return a.localeCompare(b)
    })
    
    // Return named sprints first, then "No Sprint" at the end
    return [...namedSprints, ...noSprint]
  }

  const processBurnupData = (filteredRows: TableRow[], meanPoints: number): BurnupChartData => {
    if (filteredRows.length === 0) {
      return {
        labels: [],
        datasets: []
      }
    }

    // Group artifacts by sprint
    const sprintGroups = new Map<string, TableRow[]>()
    
    filteredRows.forEach(row => {
      const sprint = row.sprint || 'No Sprint'
      if (!sprintGroups.has(sprint)) {
        sprintGroups.set(sprint, [])
      }
      sprintGroups.get(sprint)!.push(row)
    })

    // Get sorted sprint names
    const sprintNames = sortSprints(Array.from(sprintGroups.keys()))
    
    // Calculate cumulative data for each sprint
    const sprintDataArray: SprintData[] = []
    let cumulativeTotalScope = 0
    let cumulativeCompletedScope = 0

    sprintNames.forEach(sprintName => {
      const artifacts = sprintGroups.get(sprintName) || []
      
      // Calculate points for this sprint
      const sprintTotalScope = artifacts.reduce((sum, artifact) => {
        return sum + getArtifactPoints(artifact, meanPoints)
      }, 0)
      
      const sprintCompletedScope = artifacts.reduce((sum, artifact) => {
        if (isDoneStatus(artifact.status)) {
          return sum + getArtifactPoints(artifact, meanPoints)
        }
        return sum
      }, 0)
      
      // Add to cumulative totals
      cumulativeTotalScope += sprintTotalScope
      cumulativeCompletedScope += sprintCompletedScope
      
      sprintDataArray.push({
        sprintName,
        totalScope: cumulativeTotalScope,
        completedScope: cumulativeCompletedScope,
        totalItems: artifacts.length,
        completedItems: artifacts.filter(a => isDoneStatus(a.status)).length
      })
    })

    // Build chart data
    const chartData: BurnupChartData = {
      labels: sprintNames,
      datasets: [
        {
          label: 'Total Scope',
          data: sprintDataArray.map(sprint => sprint.totalScope),
          borderColor: '#1976D2', // Blue
          backgroundColor: 'rgba(25, 118, 210, 0.1)',
          tension: 0.1,
          fill: false
        },
        {
          label: 'Completed',
          data: sprintDataArray.map(sprint => sprint.completedScope),
          borderColor: '#4CAF50', // Green
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          tension: 0.1,
          fill: false
        }
      ]
    }

    return chartData
  }

  const getChartOptions = () => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index' as const,
      },
      plugins: {
        legend: {
          display: true,
          position: 'top' as const,
        },
        tooltip: {
          callbacks: {
            title: (context: any) => {
              return `Sprint: ${context[0].label}`
            },
            label: (context: any) => {
              return `${context.dataset.label}: ${context.parsed.y.toFixed(1)} pts`
            }
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Sprint'
          },
          grid: {
            display: true,
            color: 'rgba(0, 0, 0, 0.1)'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Story Points'
          },
          beginAtZero: true,
          grid: {
            display: true,
            color: 'rgba(0, 0, 0, 0.1)'
          }
        }
      },
      elements: {
        point: {
          radius: 4,
          hoverRadius: 6
        },
        line: {
          borderWidth: 2
        }
      }
    }
  }

  return {
    processBurnupData,
    getChartOptions,
    isDoneStatus,
    getArtifactPoints,
    sortSprints
  }
}