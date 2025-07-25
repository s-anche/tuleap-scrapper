import type { TableRow } from '@/composables/useStoriesTable'
import { apiService } from '@/services/api'

export interface BurnupChartData {
  labels?: string[] // Keep for backward compatibility 
  datasets: Array<{
    label: string
    data: Array<{ x: string | Date, y: number }> // Change to support date-based data points
    borderColor: string
    backgroundColor: string
    tension: number
    fill: boolean
  }>
  hasEstimatedScope?: boolean // New: indicates if estimated scope data is available
}

export interface SprintData {
  sprintName: string
  totalScope: number
  estimatedScope: number  // New: cumulative scope based on actual estimation dates
  completedScope: number
  totalItems: number
  completedItems: number
}

export const useBurnupChart = () => {
  const isDoneStatus = (status: string): boolean => {
    const statusLower = status.toLowerCase()
    return statusLower.includes('done') || 
           statusLower.includes('closed') || 
           statusLower.includes('completed') ||
           statusLower === 'done without dev'
  }

  const isCanceledStatus = (status: string): boolean => {
    const statusLower = status.toLowerCase()
    return statusLower.includes('cancel') || 
           statusLower.includes('cancelled') ||
           statusLower.includes('reject') ||
           statusLower.includes('rejected') ||
           statusLower.includes('abandon') ||
           statusLower.includes('abandoned') ||
           statusLower.includes('dropped') ||
           statusLower.includes('withdrawn')
  }

  const isActiveStatus = (status: string): boolean => {
    return !isDoneStatus(status) && !isCanceledStatus(status)
  }

  const getArtifactPoints = (artifact: TableRow, meanPoints: number, includeUnsized: boolean = true): number => {
    // If artifact has explicit points (including 0), use them
    if (artifact.points !== null && artifact.points !== undefined) {
      return artifact.points
    }
    
    // For unsized items, behavior depends on includeUnsized flag
    if (includeUnsized) {
      // Use mean points for unsized items when includeUnsized is true
      return meanPoints
    } else {
      // Exclude unsized items by returning 0 points
      return 0
    }
  }

  const filterActiveArtifacts = (artifacts: TableRow[]): TableRow[] => {
    return artifacts.filter(artifact => !isCanceledStatus(artifact.status))
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

  const processBurnupData = (
    filteredRows: TableRow[], 
    meanPoints: number, 
    options: { 
      includeCanceled?: boolean, 
      includeUnsized?: boolean 
    } = {}
  ): BurnupChartData => {
    const { includeCanceled = false, includeUnsized = true } = options
    // Validate input parameters
    if (!filteredRows || filteredRows.length === 0 || typeof meanPoints !== 'number' || isNaN(meanPoints)) {
      return {
        datasets: []
      }
    }

    // Filter out canceled items if not explicitly included
    const activeRows = includeCanceled ? filteredRows : filterActiveArtifacts(filteredRows)
    
    if (activeRows.length === 0) {
      return {
        datasets: []
      }
    }

    // Check if all lastPointsModified dates are computed (not loading/error)
    const allDatesComputed = activeRows.every(row => 
      row.lastPointsModified !== 'loading' && row.lastPointsModified !== 'error'
    )

    // Get all sprint data with dates
    const allSprintData = apiService.getAllSprintData()
    
    // If no sprint data available, create a simple chart showing only estimation data
    if (allSprintData.length === 0) {
      console.warn('No sprint data available for date-based chart, showing estimation data only')
      
      // Still try to show estimation data if available
      if (allDatesComputed) {
        const estimationEvents: Array<{ date: Date, points: number }> = []
        
        activeRows.forEach(artifact => {
          if (artifact.lastPointsModified && typeof artifact.lastPointsModified === 'string') {
            const estimationDate = new Date(artifact.lastPointsModified)
            const points = getArtifactPoints(artifact, meanPoints, includeUnsized)
            estimationEvents.push({ date: estimationDate, points })
          }
        })
        
        if (estimationEvents.length > 0) {
          estimationEvents.sort((a, b) => a.date.getTime() - b.date.getTime())
          
          let cumulativeEstimatedScope = 0
          const estimatedScopeData: Array<{ x: Date, y: number }> = []
          
          estimationEvents.forEach(event => {
            cumulativeEstimatedScope += event.points
            estimatedScopeData.push({ x: event.date, y: cumulativeEstimatedScope })
          })
          
          return {
            datasets: [{
              label: 'Estimated Scope (Actual)',
              data: estimatedScopeData,
              borderColor: '#FF9800', // Orange
              backgroundColor: 'rgba(255, 152, 0, 0.1)',
              tension: 0.1,
              fill: false
            }],
            hasEstimatedScope: true
          }
        }
      }
      
      return {
        datasets: []
      }
    }

    // Calculate date range for the chart
    const allDates: Date[] = []
    
    // Add sprint end dates
    allSprintData.forEach(sprint => {
      if (sprint.endDate) {
        allDates.push(new Date(sprint.endDate))
      }
    })
    
    // Add estimation dates  
    activeRows.forEach(row => {
      if (row.lastPointsModified && typeof row.lastPointsModified === 'string') {
        allDates.push(new Date(row.lastPointsModified))
      }
    })

    // Sort dates to create timeline
    allDates.sort((a, b) => a.getTime() - b.getTime())
    
    if (allDates.length === 0) {
      return {
        datasets: []
      }
    }

    // Create data points for completed scope (using sprint end dates)
    const completedScopeData: Array<{ x: Date, y: number }> = []
    const estimatedScopeData: Array<{ x: Date, y: number }> = []

    // Group artifacts by sprint for easier processing
    const sprintGroups = new Map<string, TableRow[]>()
    activeRows.forEach(row => {
      const sprint = row.sprint || 'No Sprint'
      if (!sprintGroups.has(sprint)) {
        sprintGroups.set(sprint, [])
      }
      sprintGroups.get(sprint)!.push(row)
    })
    
    // Sort sprints by end date
    const sortedSprints = allSprintData
      .filter(sprint => sprint.endDate && sprintGroups.has(sprint.title))
      .sort((a, b) => new Date(a.endDate!).getTime() - new Date(b.endDate!).getTime())

    sortedSprints.forEach(sprintData => {
      const sprintEndDate = new Date(sprintData.endDate!)
      
      // For completed scope: count ALL completed items up to this sprint end date
      // (not just items from this specific sprint)
      let completedScopeAtThisDate = 0
      
      // Check all active rows to see which ones should be considered completed by this date
      activeRows.forEach(artifact => {
        if (isDoneStatus(artifact.status)) {
          // Get the sprint end date for this artifact's sprint
          const artifactSprint = allSprintData.find(s => s.title === artifact.sprint)
          if (artifactSprint && artifactSprint.endDate) {
            const artifactSprintEndDate = new Date(artifactSprint.endDate)
            // If this artifact's sprint ended on or before the current date, count it as completed
            if (artifactSprintEndDate <= sprintEndDate) {
              completedScopeAtThisDate += getArtifactPoints(artifact, meanPoints, includeUnsized)
            }
          }
        }
      })
      
      completedScopeData.push({ x: sprintEndDate, y: completedScopeAtThisDate })
    })

    // Process estimated scope using actual estimation dates
    if (allDatesComputed) {
      // Collect all estimation events with their dates
      const estimationEvents: Array<{ date: Date, points: number }> = []
      
      activeRows.forEach(artifact => {
        if (artifact.lastPointsModified && typeof artifact.lastPointsModified === 'string') {
          const estimationDate = new Date(artifact.lastPointsModified)
          const points = getArtifactPoints(artifact, meanPoints, includeUnsized)
          estimationEvents.push({ date: estimationDate, points })
        }
      })
      
      // Sort by date and create cumulative data
      estimationEvents.sort((a, b) => a.date.getTime() - b.date.getTime())
      
      let cumulativeEstimatedScope = 0
      estimationEvents.forEach(event => {
        cumulativeEstimatedScope += event.points
        estimatedScopeData.push({ x: event.date, y: cumulativeEstimatedScope })
      })
    }

    // Build datasets
    const datasets = []

    // Only add estimated scope dataset if all dates are computed
    if (allDatesComputed && estimatedScopeData.length > 0) {
      datasets.push({
        label: 'Estimated Scope (Actual)',
        data: estimatedScopeData,
        borderColor: '#FF9800', // Orange
        backgroundColor: 'rgba(255, 152, 0, 0.1)',
        tension: 0.1,
        fill: false
      })
    }

    // Always add completed dataset
    if (completedScopeData.length > 0) {
      datasets.push({
        label: 'Completed',
        data: completedScopeData,
        borderColor: '#4CAF50', // Green
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        tension: 0.1,
        fill: false
      })
    }

    const chartData: BurnupChartData = {
      datasets,
      hasEstimatedScope: allDatesComputed && estimatedScopeData.length > 0
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
            title: (context: unknown[]) => {
              const firstContext = context[0] as { parsed: { x: number } }
              const date = new Date(firstContext.parsed.x)
              return `Date: ${date.toLocaleDateString()}`
            },
            label: (context: { dataset: { label: string }, parsed: { y: number } }) => {
              return `${context.dataset.label}: ${context.parsed.y.toFixed(1)} pts`
            }
          }
        }
      },
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'day',
            displayFormats: {
              day: 'MMM dd',
              week: 'MMM dd',
              month: 'MMM yyyy'
            },
            tooltipFormat: 'PPP'
          },
          title: {
            display: true,
            text: 'Date'
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
    isCanceledStatus,
    isActiveStatus,
    filterActiveArtifacts,
    getArtifactPoints,
    sortSprints
  }
}