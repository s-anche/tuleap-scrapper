import type {
  Project,
  Tracker,
  Artifact,
  Epic,
  TuleapArtifact,
  TuleapArtifactLink,
  TuleapArtifactValue,
  TuleapChangeset,
  QueryParams,
  ProjectQuery,
  TrackerQuery,
  ArtifactQuery,
} from '@/types/api'

// Get base URL from runtime config, fallback to production URL
const getBaseURL = (): string => {
  if (process.client) {
    const config = useRuntimeConfig()
    return config.public.tuleapApiUrl
  }
  return process.env.NUXT_PUBLIC_TULEAP_API_URL || 'https://tuleap-web.swmcloud.net/api'
}

// Helper function to get auth headers
const getAuthHeaders = (): Record<string, string> => {
  const token = process.client ? localStorage.getItem('tuleap_token') : null
  return token ? { 'X-Auth-AccessKey': token } : {}
}

// Custom fetch wrapper with auth and error handling
const apiRequest = async <T>(endpoint: string, options: any = {}): Promise<T> => {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeaders(),
    ...options.headers,
  }

  const fetchOptions = {
    method: options.method || 'GET',
    headers,
    query: options.query,
  }

  try {
    const response = await $fetch<T>(`${getBaseURL()}${endpoint}`, fetchOptions)
    return response
  } catch (error: any) {
    console.error(`❌ API Request failed: ${getBaseURL()}${endpoint}`, {
      status: error.statusCode,
      message: error.message,
      data: error.data
    })
    
    if (error.statusCode === 401) {
      if (process.client) {
        localStorage.removeItem('tuleap_token')
        await navigateTo('/login')
      }
    }
    throw error
  }
}

// Sprint cache for performance optimization
const sprintCache = new Map<number, Artifact>()

// Real API Service Methods
export const apiService = {
  // Projects
  async getProjects(params: QueryParams & { query?: ProjectQuery } = {}): Promise<Project[]> {
    const response = await apiRequest<{ collection: Project[] }>('/projects', {
      method: 'GET',
      query: params,
    })
    return response.collection || []
  },

  async getProject(id: number): Promise<Project> {
    return await apiRequest<Project>(`/projects/${id}`)
  },

  // Trackers
  async getProjectTrackers(
    projectId: number,
    params: QueryParams & { query?: TrackerQuery } = {},
  ): Promise<Tracker[]> {
    const response = await apiRequest<{ collection: Tracker[] }>(
      `/projects/${projectId}/trackers`,
      {
        method: 'GET',
        query: params,
      },
    )
    return response.collection || []
  },

  async getTracker(id: number): Promise<Tracker> {
    return await apiRequest<Tracker>(`/trackers/${id}`)
  },

  // Artifacts
  async getTrackerArtifacts(
    trackerId: number,
    params: QueryParams & { query?: ArtifactQuery } = {},
  ): Promise<Artifact[]> {
    const response = await apiRequest<{ collection: Artifact[] }>(
      `/trackers/${trackerId}/artifacts`,
      {
        method: 'GET',
        query: params,
      },
    )
    return response.collection || []
  },

  async getArtifact(id: number, params: QueryParams = {}): Promise<Artifact> {
    return await apiRequest<Artifact>(`/artifacts/${id}`, {
      method: 'GET',
      query: params,
    })
  },

  async getArtifacts(ids: number[], params: QueryParams = {}): Promise<Artifact[]> {
    const promises = ids.map((id) =>
      apiRequest<Artifact>(`/artifacts/${id}`, {
        method: 'GET',
        query: params,
      }),
    )
    const responses = await Promise.allSettled(promises)
    return responses
      .filter((response) => response.status === 'fulfilled')
      .map((response) => (response as PromiseFulfilledResult<Artifact>).value)
  },

  // Helper method to build correct Tuleap URL
  buildTuleapUrl(htmlUrl: string | undefined, artifactId: number): string {
    const baseUrl = 'https://tuleap-web.swmcloud.net'

    if (htmlUrl) {
      // If it's already a complete URL, use it
      if (htmlUrl.startsWith('http')) {
        return htmlUrl
      }
      // If it's a relative URL, prepend the base URL
      return `${baseUrl}${htmlUrl}`
    }

    // Fallback to the standard tracker URL format
    return `${baseUrl}/plugins/tracker/?aid=${artifactId}`
  },

  // Epic-specific methods
  async getEpicById(id: number): Promise<Epic> {
    try {
      const artifact = await apiRequest<TuleapArtifact>(`/artifacts/${id}`)
      return this.transformArtifactToEpic(artifact)
    } catch (error: unknown) {
      console.error(`Error fetching epic ${id}:`, error)

      // If it's a 404, throw a more specific error
      if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 404) {
        throw new Error(`Epic #${id} not found`)
      }

      // If it's an auth error, throw a more specific error
      if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 401) {
        throw new Error('Authentication failed. Please check your API token.')
      }

      // For other errors, throw a generic error
      throw new Error(`Failed to fetch epic #${id}. Please check your connection and try again.`)
    }
  },

  transformArtifactToEpic(artifact: TuleapArtifact): Epic {
    const getFieldValue = (fieldId: number) => {
      const field = artifact.values?.find((v: TuleapArtifactValue) => v.field_id === fieldId)
      return field?.value || field?.values?.[0]?.label || null
    }

    const getFieldByLabel = (label: string) => {
      const field = artifact.values?.find((v: TuleapArtifactValue) => v.label === label)
      return field?.value || field?.values?.[0]?.label || null
    }

    const getLinksField = () => {
      // Try different possible field names for links
      const possibleLinkFields = [
        'Links',
        'links',
        'Linked artifacts',
        'Linked Artifacts',
        'Artifact Links',
        'Related Artifacts',
      ]

      for (const fieldName of possibleLinkFields) {
        const field = artifact.values?.find((v: TuleapArtifactValue) => v.label === fieldName)
        if (field) {
          return field?.links || []
        }
      }
      return []
    }

    const categorizeLinks = (links: TuleapArtifactLink[]) => {
      const categories = {
        features: [] as TuleapArtifactLink[],
        stories: [] as TuleapArtifactLink[],
        tasks: [] as TuleapArtifactLink[],
        defects: [] as TuleapArtifactLink[],
      }

      links.forEach((link) => {
        const trackerLabel = link.tracker.label.toLowerCase()
        if (trackerLabel.includes('feature')) {
          categories.features.push(link)
        } else if (trackerLabel.includes('stories') || trackerLabel.includes('story')) {
          categories.stories.push(link)
        } else if (trackerLabel.includes('task')) {
          categories.tasks.push(link)
        } else if (trackerLabel.includes('defect')) {
          categories.defects.push(link)
        }
      })

      return categories
    }

    const getTagsFromField = () => {
      const field = artifact.values?.find((v: TuleapArtifactValue) => v.label === 'Tags')
      return field?.bind_value_ids || []
    }

    const links = getLinksField()
    const categorizedLinks = categorizeLinks(links)

    return {
      id: artifact.id,
      title: artifact.title || getFieldValue(5697) || `Epic #${artifact.id}`,
      status: artifact.status || artifact.full_status?.value || 'Unknown',
      summary: this.decodeHtmlEntities(
        artifact.values_by_field?.description?.value ||
          artifact.values_by_field?.description?.commonmark ||
          getFieldByLabel('Description') ||
          '',
      ),
      leadTeam: getFieldByLabel('Lead Team'),
      estimation: artifact.values_by_field?.capacity?.value || getFieldValue(5687),
      remainingEffort: artifact.values_by_field?.remaining_effort?.value || getFieldValue(5688),
      lastUpdateDate: artifact.last_modified_date,
      htmlUrl: this.buildTuleapUrl(artifact.html_url, artifact.id),
      project: {
        id: artifact.project.id,
        label: artifact.project.label,
        icon: artifact.project.icon,
      },
      tracker: {
        id: artifact.tracker.id,
        label: artifact.tracker.label,
        color: artifact.tracker.color_name,
      },
      submittedBy: {
        id: artifact.submitted_by_user.id,
        name: artifact.submitted_by_user.real_name,
        username: artifact.submitted_by_user.username,
        avatar_url: artifact.submitted_by_user.avatar_url,
      },
      links: categorizedLinks,
      tags: getTagsFromField(),
      expectedEndDate: getFieldByLabel('Expected end dev date'),
      realEndDate: getFieldByLabel('🏁 Real end dev date'),
      expectedStartDate: getFieldByLabel('Expected start dev date'),
      realStartDate: getFieldByLabel('▶ Real start dev date'),
    }
  },

  // Helper method to decode HTML entities
  decodeHtmlEntities(text: string): string {
    if (!text) return text

    const entityMap: { [key: string]: string } = {
      '&lt;': '<',
      '&gt;': '>',
      '&amp;': '&',
      '&quot;': '"',
      '&#39;': "'",
      '&nbsp;': ' ',
      '&copy;': '©',
      '&reg;': '®',
      '&trade;': '™',
      '&ldquo;': '"',
      '&rdquo;': '"',
      '&lsquo;': "'",
      '&rsquo;': "'",
      '&ndash;': '–',
      '&mdash;': '—',
      '&hellip;': '…',
    }

    return text.replace(/&[a-zA-Z0-9#]+;/g, (entity) => {
      return entityMap[entity] || entity
    })
  },

  // Helper methods for field extraction
  extractFieldValue(artifact: TuleapArtifact, fieldName: string): unknown {
    const field = artifact.values?.find((v: TuleapArtifactValue) => v.label === fieldName)
    return field?.value || field?.values?.[0]?.label || null
  },

  extractPoints(artifact: TuleapArtifact): number | null {
    const points =
      this.extractFieldValue(artifact, 'Points') ||
      this.extractFieldValue(artifact, 'Story Points') ||
      this.extractFieldValue(artifact, 'Estimation') ||
      artifact.values_by_field?.points?.value ||
      artifact.values_by_field?.story_points?.value ||
      artifact.values_by_field?.estimation?.value

    // Return null only if points is undefined/null, not if it's 0
    if (points === undefined || points === null || points === '') {
      return null
    }

    const numericPoints = Number(points)
    return isNaN(numericPoints) ? null : numericPoints
  },

  extractRemainingEffort(artifact: TuleapArtifact): number | null {
    const remainingEffort =
      this.extractFieldValue(artifact, 'Remaining Effort') ||
      this.extractFieldValue(artifact, 'Remaining effort') ||
      artifact.values_by_field?.remaining_effort?.value
    return remainingEffort ? Number(remainingEffort) : null
  },

  async extractSprintInfo(artifact: TuleapArtifact): Promise<string | null> {
    // First try direct sprint fields (backward compatibility)
    const directSprint =
      this.extractFieldValue(artifact, 'Sprint') ||
      this.extractFieldValue(artifact, 'Iteration') ||
      artifact.values_by_field?.sprint?.value ||
      artifact.values_by_field?.iteration?.value

    if (directSprint) {
      return String(directSprint)
    }

    // Look for sprint in reverse_links
    const linksField = artifact.values?.find((v: TuleapArtifactValue) => v.label === 'Links')
    const reverseLinks = linksField?.reverse_links || []

    const sprintLink = reverseLinks.find((link: TuleapArtifactLink) =>
      link.tracker.label.toLowerCase().includes('sprint'),
    )

    if (sprintLink) {
      try {
        // Check cache first
        if (sprintCache.has(sprintLink.id)) {
          const cachedSprint = sprintCache.get(sprintLink.id)!
          return cachedSprint.title || null
        }

        // Fetch sprint artifact
        const sprintArtifact = await this.getArtifact(sprintLink.id)

        // Cache the result
        sprintCache.set(sprintLink.id, sprintArtifact)

        return sprintArtifact.title || null
      } catch (error) {
        console.error(`Error fetching sprint artifact ${sprintLink.id}:`, error)
        return null
      }
    }

    return null
  },

  // Method to fetch linked artifacts using the optimized endpoint with pagination
  async getLinkedArtifacts(
    artifactId: number,
    direction: 'forward' | 'reverse' = 'forward',
    nature: string = '_is_child',
  ): Promise<TuleapArtifact[]> {
    try {
      const allArtifacts: TuleapArtifact[] = []
      let offset = 0
      const limit = 50 // Fetch 50 items per page
      let hasMore = true

      while (hasMore) {
        const response = await apiRequest<{ collection: TuleapArtifact[] }>(
          `/artifacts/${artifactId}/linked_artifacts`,
          {
            method: 'GET',
            query: {
              direction,
              nature,
              limit,
              offset,
            },
          },
        )
        
        const artifacts = response.collection || []
        allArtifacts.push(...artifacts)
        
        // If we got fewer items than the limit, we've reached the end
        hasMore = artifacts.length === limit
        offset += limit
      }

      return allArtifacts
    } catch (error) {
      console.error(`Error fetching linked artifacts for ${artifactId}:`, error)
      return []
    }
  },

  // Method to fetch sub-artifacts for a given artifact (Features -> Tasks/Stories)
  async getSubArtifacts(artifact: TuleapArtifact): Promise<TuleapArtifact[]> {
    // Use the optimized linked_artifacts endpoint
    return await this.getLinkedArtifacts(artifact.id, 'forward', '_is_child')
  },

  // Method to fetch related artifacts based on epic links
  async getRelatedArtifacts(epic: Epic): Promise<{
    features: TuleapArtifact[]
    stories: TuleapArtifact[]
    tasks: TuleapArtifact[]
    defects: TuleapArtifact[]
  }> {
    const results = {
      features: [] as TuleapArtifact[],
      stories: [] as TuleapArtifact[],
      tasks: [] as TuleapArtifact[],
      defects: [] as TuleapArtifact[],
    }

    // Use the optimized linked_artifacts endpoint to get all children at once
    try {
      const linkedArtifacts = await this.getLinkedArtifacts(epic.id, 'forward', '_is_child')

      // Categorize the artifacts based on their tracker type
      linkedArtifacts.forEach((artifact) => {
        const trackerLabel = artifact.tracker.label.toLowerCase()

        if (trackerLabel.includes('feature')) {
          results.features.push(artifact)
        } else if (trackerLabel.includes('stories') || trackerLabel.includes('story')) {
          results.stories.push(artifact)
        } else if (trackerLabel.includes('task')) {
          results.tasks.push(artifact)
        } else if (trackerLabel.includes('defect')) {
          results.defects.push(artifact)
        }
      })
    } catch (error) {
      console.error('Error fetching related artifacts:', error)
    }

    return results
  },

  // Method to fetch artifact changesets (optimized for points tracking)
  async getArtifactChangesets(artifactId: number): Promise<TuleapChangeset[]> {
    try {
      const allChangesets: TuleapChangeset[] = []
      let offset = 0
      const limit = 30 // Reduced from 50 to limit payload
      const maxChangesets = 30 // Only fetch recent changesets for performance
      let hasMore = true

      while (hasMore && allChangesets.length < maxChangesets) {
        const response = await apiRequest<TuleapChangeset[] | { collection: TuleapChangeset[] }>(
          `/artifacts/${artifactId}/changesets`,
          {
            method: 'GET',
            query: {
              // Remove 'fields=all' to reduce payload size
              limit,
              offset,
              order: 'desc', // Get most recent first
            },
          },
        )

        // Handle both direct array and collection wrapper formats
        const changesets = Array.isArray(response) ? response : (response.collection || [])
        allChangesets.push(...changesets)

        hasMore = changesets.length === limit
        offset += limit
      }

      // Reverse to get chronological order for analysis
      return allChangesets.reverse()
    } catch (error) {
      console.error(`Error fetching changesets for artifact ${artifactId}:`, error)
      return []
    }
  },

  // Utility function to find the last modification date of points field
  findLastPointsModification(changesets: TuleapChangeset[]): string | null {
    if (changesets.length === 0) return null

    let lastModifiedDate: string | null = null
    let previousPointsValue: any = null

    for (const changeset of changesets) {
      const pointsField = changeset.values.find(
        (value) => value.label === 'Points' || value.field_id === 19574
      )

      if (pointsField) {
        const currentPointsValue = {
          values: pointsField.values || [],
          bind_value_ids: pointsField.bind_value_ids || [],
        }

        // Check if this is the first changeset with points field
        if (previousPointsValue === null) {
          // If the field has values, this is when points were first set
          if (currentPointsValue.values.length > 0 || currentPointsValue.bind_value_ids.length > 0) {
            lastModifiedDate = changeset.submitted_on
          }
        } else {
          // Compare with previous changeset
          const valuesChanged = 
            JSON.stringify(currentPointsValue.values) !== JSON.stringify(previousPointsValue.values) ||
            JSON.stringify(currentPointsValue.bind_value_ids) !== JSON.stringify(previousPointsValue.bind_value_ids)

          if (valuesChanged) {
            lastModifiedDate = changeset.submitted_on
          }
        }

        previousPointsValue = currentPointsValue
      }
    }

    return lastModifiedDate
  },

  // Method to fetch hierarchical tree data for epic
  async getEpicTreeData(epic: Epic): Promise<{
    features: Array<{
      artifact: TuleapArtifact
      subArtifacts: TuleapArtifact[]
      points: number | null
      remainingEffort: number | null
      linkedArtifactCount: number
      percentWithPoints: number
    }>
    directStories: TuleapArtifact[]
    directTasks: TuleapArtifact[]
    defects: TuleapArtifact[]
  }> {
    const relatedArtifacts = await this.getRelatedArtifacts(epic)
    // Process features with their sub-artifacts
    const features = await Promise.all(
      relatedArtifacts.features.map(async (feature) => {
        const subArtifacts = await this.getSubArtifacts(feature)
        const points = this.extractPoints(feature)
        const remainingEffort = this.extractRemainingEffort(feature)
        const linkedArtifactCount = subArtifacts.length

        // Calculate percentage of sub-artifacts with points
        const artifactsWithPoints = subArtifacts.filter((sub) => this.extractPoints(sub) !== null)
        const percentWithPoints =
          linkedArtifactCount > 0
            ? Math.round((artifactsWithPoints.length / linkedArtifactCount) * 100)
            : 0

        return {
          artifact: feature,
          subArtifacts,
          points,
          remainingEffort,
          linkedArtifactCount,
          percentWithPoints,
        }
      }),
    )

    const result = {
      features,
      directStories: relatedArtifacts.stories,
      directTasks: relatedArtifacts.tasks,
      defects: relatedArtifacts.defects,
    }

    return result
  },
}

export default apiService
