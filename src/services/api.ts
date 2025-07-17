import axios from 'axios'
import type { 
  Project, 
  Tracker, 
  Artifact, 
  Epic,
  TuleapArtifact,
  TuleapArtifactLink,
  TuleapArtifactValue,
  QueryParams, 
  ProjectQuery, 
  TrackerQuery, 
  ArtifactQuery 
} from '@/types/api'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://tuleap-web.swmcloud.net/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tuleap_token')
    if (token) {
      config.headers['X-Auth-AccessKey'] = token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('tuleap_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Real API Service Methods
export const apiService = {
  // Projects
  async getProjects(params: QueryParams & { query?: ProjectQuery } = {}): Promise<Project[]> {
    const response = await api.get('/projects', { params })
    return response.data.collection || []
  },

  async getProject(id: number): Promise<Project> {
    const response = await api.get(`/projects/${id}`)
    return response.data
  },

  // Trackers
  async getProjectTrackers(projectId: number, params: QueryParams & { query?: TrackerQuery } = {}): Promise<Tracker[]> {
    const response = await api.get(`/projects/${projectId}/trackers`, { params })
    return response.data.collection || []
  },

  async getTracker(id: number): Promise<Tracker> {
    const response = await api.get(`/trackers/${id}`)
    return response.data
  },

  // Artifacts
  async getTrackerArtifacts(trackerId: number, params: QueryParams & { query?: ArtifactQuery } = {}): Promise<Artifact[]> {
    const response = await api.get(`/trackers/${trackerId}/artifacts`, { params })
    return response.data.collection || []
  },

  async getArtifact(id: number, params: QueryParams = {}): Promise<Artifact> {
    const response = await api.get(`/artifacts/${id}`, { params })
    return response.data
  },

  async getArtifacts(ids: number[], params: QueryParams = {}): Promise<Artifact[]> {
    const promises = ids.map(id => api.get(`/artifacts/${id}`, { params }))
    const responses = await Promise.allSettled(promises)
    return responses
      .filter(response => response.status === 'fulfilled')
      .map(response => (response as PromiseFulfilledResult<{ data: Artifact }>).value.data)
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
      const response = await api.get(`/artifacts/${id}`)
      return this.transformArtifactToEpic(response.data)
    } catch (error: unknown) {
      console.error(`Error fetching epic ${id}:`, error)
      
      // If it's a 404, throw a more specific error
      if ((error as any).response?.status === 404) {
        throw new Error(`Epic #${id} not found`)
      }
      
      // If it's an auth error, throw a more specific error  
      if ((error as any).response?.status === 401) {
        throw new Error('Authentication failed. Please check your API token.')
      }
      
      // If it's a network error, throw a more specific error
      if (!(error as any).response) {
        throw new Error('Network error. Please check your connection.')
      }
      
      // For other errors, throw a generic error
      throw new Error(`Failed to fetch epic #${id}. Please check your connection and try again.`)
    }
  },

  transformArtifactToEpic(artifact: TuleapArtifact): Epic {
    console.log('=== transformArtifactToEpic START ===')
    console.log('Raw artifact values:', artifact.values)
    console.log('Available field labels:', artifact.values?.map(v => v.label))
    
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
      const possibleLinkFields = ['Links', 'links', 'Linked artifacts', 'Linked Artifacts', 'Artifact Links', 'Related Artifacts']
      
      for (const fieldName of possibleLinkFields) {
        const field = artifact.values?.find((v: TuleapArtifactValue) => v.label === fieldName)
        if (field) {
          console.log(`Found links field with name: "${fieldName}"`)
          console.log('Links field found:', field)
          console.log('Links field.links:', field?.links)
          return field?.links || []
        }
      }
      
      // If no field found, log all field names for debugging
      console.log('No links field found with any expected name')
      console.log('Available field names:', artifact.values?.map(v => v.label))
      return []
    }

    const categorizeLinks = (links: TuleapArtifactLink[]) => {
      console.log('Categorizing links, count:', links.length)
      const categories = {
        features: [] as TuleapArtifactLink[],
        stories: [] as TuleapArtifactLink[],
        tasks: [] as TuleapArtifactLink[],
        defects: [] as TuleapArtifactLink[]
      }

      links.forEach((link, index) => {
        const trackerLabel = link.tracker.label.toLowerCase()
        console.log(`Link ${index}: tracker label = "${link.tracker.label}" (lowercase: "${trackerLabel}")`)
        if (trackerLabel.includes('feature')) {
          console.log(`  -> Categorized as feature`)
          categories.features.push(link)
        } else if (trackerLabel.includes('stories') || trackerLabel.includes('story')) {
          console.log(`  -> Categorized as story`)
          categories.stories.push(link)
        } else if (trackerLabel.includes('task')) {
          console.log(`  -> Categorized as task`)
          categories.tasks.push(link)
        } else if (trackerLabel.includes('defect')) {
          console.log(`  -> Categorized as defect`)
          categories.defects.push(link)
        } else {
          console.log(`  -> NOT CATEGORIZED (unknown tracker type)`)
        }
      })

      return categories
    }

    const getTagsFromField = () => {
      const field = artifact.values?.find((v: TuleapArtifactValue) => v.label === 'Tags')
      return field?.bind_value_ids || []
    }

    const links = getLinksField()
    console.log('Raw links from getLinksField:', links)
    console.log('Links count:', links.length)
    
    const categorizedLinks = categorizeLinks(links)
    console.log('Categorized links:', categorizedLinks)
    console.log('Categorized links counts:', {
      features: categorizedLinks.features.length,
      stories: categorizedLinks.stories.length,
      tasks: categorizedLinks.tasks.length,
      defects: categorizedLinks.defects.length
    })

    return {
      id: artifact.id,
      title: artifact.title || getFieldValue(5697) || `Epic #${artifact.id}`,
      status: artifact.status || artifact.full_status?.value || 'Unknown',
      summary: this.decodeHtmlEntities(
        artifact.values_by_field?.description?.value || 
        artifact.values_by_field?.description?.commonmark || 
        getFieldByLabel('Description') || ''
      ),
      leadTeam: getFieldByLabel('Lead Team'),
      estimation: artifact.values_by_field?.capacity?.value || getFieldValue(5687),
      remainingEffort: artifact.values_by_field?.remaining_effort?.value || getFieldValue(5688),
      lastUpdateDate: artifact.last_modified_date,
      htmlUrl: this.buildTuleapUrl(artifact.html_url, artifact.id),
      project: {
        id: artifact.project.id,
        label: artifact.project.label,
        icon: artifact.project.icon
      },
      tracker: {
        id: artifact.tracker.id,
        label: artifact.tracker.label,
        color: artifact.tracker.color_name
      },
      submittedBy: {
        id: artifact.submitted_by_user.id,
        name: artifact.submitted_by_user.real_name,
        username: artifact.submitted_by_user.username,
        avatar_url: artifact.submitted_by_user.avatar_url
      },
      links: categorizedLinks,
      tags: getTagsFromField(),
      expectedEndDate: getFieldByLabel('Expected end dev date'),
      realEndDate: getFieldByLabel('🏁 Real end dev date'),
      expectedStartDate: getFieldByLabel('Expected start dev date'),
      realStartDate: getFieldByLabel('▶ Real start dev date')
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
      '&hellip;': '…'
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
    const points = this.extractFieldValue(artifact, 'Points') || 
                  this.extractFieldValue(artifact, 'Story Points') ||
                  this.extractFieldValue(artifact, 'Estimation') ||
                  artifact.values_by_field?.points?.value ||
                  artifact.values_by_field?.story_points?.value ||
                  artifact.values_by_field?.estimation?.value
    return points ? Number(points) : null
  },

  extractRemainingEffort(artifact: TuleapArtifact): number | null {
    const remainingEffort = this.extractFieldValue(artifact, 'Remaining Effort') ||
                           this.extractFieldValue(artifact, 'Remaining effort') ||
                           artifact.values_by_field?.remaining_effort?.value
    return remainingEffort ? Number(remainingEffort) : null
  },

  extractSprintInfo(artifact: TuleapArtifact): string | null {
    const sprint = this.extractFieldValue(artifact, 'Sprint') ||
                   this.extractFieldValue(artifact, 'Iteration') ||
                   artifact.values_by_field?.sprint?.value ||
                   artifact.values_by_field?.iteration?.value
    return sprint ? String(sprint) : null
  },

  // Method to fetch sub-artifacts for a given artifact (Features -> Tasks/Stories)
  async getSubArtifacts(artifact: TuleapArtifact): Promise<TuleapArtifact[]> {
    const linksField = artifact.values?.find((v: TuleapArtifactValue) => v.label === 'Links')
    const links = linksField?.links || []

    if (links.length === 0) return []

    try {
      const artifactPromises = links.map(link => api.get(`/artifacts/${link.id}`))
      const responses = await Promise.allSettled(artifactPromises)

      const subArtifacts: TuleapArtifact[] = []
      responses.forEach((response, index) => {
        if (response.status === 'fulfilled') {
          subArtifacts.push(response.value.data as TuleapArtifact)
        } else {
          // Skip failed API calls
          return
        }
      })

      return subArtifacts
    } catch (error) {
      console.error('Error fetching sub-artifacts:', error)
      return []
    }
  },


  // Method to fetch related artifacts based on epic links
  async getRelatedArtifacts(epic: Epic): Promise<{
    features: TuleapArtifact[],
    stories: TuleapArtifact[],
    tasks: TuleapArtifact[],
    defects: TuleapArtifact[]
  }> {
    console.log('=== getRelatedArtifacts START ===')
    console.log('Epic links passed to getRelatedArtifacts:', epic.links)
    
    const results = {
      features: [] as TuleapArtifact[],
      stories: [] as TuleapArtifact[],
      tasks: [] as TuleapArtifact[],
      defects: [] as TuleapArtifact[]
    }

    if (!epic.links) {
      console.log('No epic links found, returning empty results')
      console.log('=== getRelatedArtifacts END ===')
      return results
    }

    // Fetch all related artifacts in parallel
    const allArtifactIds = [
      ...epic.links.features.map(link => link.id),
      ...epic.links.stories.map(link => link.id),
      ...epic.links.tasks.map(link => link.id),
      ...epic.links.defects.map(link => link.id)
    ]
    
    console.log('All artifact IDs collected:', allArtifactIds)
    console.log('Total artifacts to fetch:', allArtifactIds.length)

    if (allArtifactIds.length === 0) {
      console.log('No artifact IDs found, returning empty results')
      console.log('=== getRelatedArtifacts END ===')
      return results
    }

    try {
      const artifactPromises = allArtifactIds.map(id => api.get(`/artifacts/${id}`))
      const responses = await Promise.allSettled(artifactPromises)

      responses.forEach((response, index) => {
        const artifactId = allArtifactIds[index]
        let artifact: TuleapArtifact

        if (response.status === 'fulfilled') {
          artifact = response.value.data as TuleapArtifact
        } else {
          // Skip failed API calls
          return
        }
        
        // Categorize the artifact based on its tracker type
        if (epic.links!.features.some(link => link.id === artifactId)) {
          results.features.push(artifact)
        } else if (epic.links!.stories.some(link => link.id === artifactId)) {
          results.stories.push(artifact)
        } else if (epic.links!.tasks.some(link => link.id === artifactId)) {
          results.tasks.push(artifact)
        } else if (epic.links!.defects.some(link => link.id === artifactId)) {
          results.defects.push(artifact)
        }
      })
    } catch (error) {
      console.error('Error fetching related artifacts:', error)
    }

    console.log('Final results from getRelatedArtifacts:', results)
    console.log('=== getRelatedArtifacts END ===')
    
    return results
  },

  // Method to fetch hierarchical tree data for epic
  async getEpicTreeData(epic: Epic): Promise<{
    features: Array<{
      artifact: TuleapArtifact,
      subArtifacts: TuleapArtifact[],
      points: number | null,
      remainingEffort: number | null,
      linkedArtifactCount: number,
      percentWithPoints: number
    }>,
    directStories: TuleapArtifact[],
    directTasks: TuleapArtifact[],
    defects: TuleapArtifact[]
  }> {
    console.log('=== API getEpicTreeData START ===')
    console.log('Epic passed to getEpicTreeData:', epic)
    console.log('Epic links in getEpicTreeData:', epic.links)
    
    const relatedArtifacts = await this.getRelatedArtifacts(epic)
    console.log('Related artifacts fetched:', relatedArtifacts)
    console.log('Related artifacts counts:', {
      features: relatedArtifacts.features.length,
      stories: relatedArtifacts.stories.length,
      tasks: relatedArtifacts.tasks.length,
      defects: relatedArtifacts.defects.length
    })
    
    // Process features with their sub-artifacts
    const features = await Promise.all(
      relatedArtifacts.features.map(async (feature) => {
        const subArtifacts = await this.getSubArtifacts(feature)
        const points = this.extractPoints(feature)
        const remainingEffort = this.extractRemainingEffort(feature)
        const linkedArtifactCount = subArtifacts.length
        
        // Calculate percentage of sub-artifacts with points
        const artifactsWithPoints = subArtifacts.filter(sub => this.extractPoints(sub) !== null)
        const percentWithPoints = linkedArtifactCount > 0 
          ? Math.round((artifactsWithPoints.length / linkedArtifactCount) * 100)
          : 0

        return {
          artifact: feature,
          subArtifacts,
          points,
          remainingEffort,
          linkedArtifactCount,
          percentWithPoints
        }
      })
    )

    const result = {
      features,
      directStories: relatedArtifacts.stories,
      directTasks: relatedArtifacts.tasks,
      defects: relatedArtifacts.defects
    }
    
    console.log('Final tree data result:', result)
    console.log('=== API getEpicTreeData END ===')
    
    return result
  }
}

export default api