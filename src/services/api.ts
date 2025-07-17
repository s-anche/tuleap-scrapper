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
import {
  mockProjects,
  mockTrackers,
  mockArtifacts,
  getProjectById,
  getTrackersByProjectId,
  getArtifactsByTrackerId,
  searchProjects,
  searchArtifacts
} from '@/data/mockData'

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

// Mock API Service Methods
export const apiService = {
  // Projects
  async getProjects(params: QueryParams & { query?: ProjectQuery } = {}): Promise<Project[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const { query, limit = 50, offset = 0 } = params
    let projects = mockProjects
    
    // Apply query filters
    if (query?.shortname) {
      projects = searchProjects(query.shortname)
    }
    if (query?.is_member_of) {
      // For mock, assume all projects are accessible
      projects = mockProjects
    }
    if (query?.is_admin_of) {
      // For mock, assume user is admin of first 2 projects
      projects = mockProjects.slice(0, 2)
    }
    
    // Apply pagination
    return projects.slice(offset, offset + limit)
  },

  async getProject(id: number): Promise<Project> {
    await new Promise(resolve => setTimeout(resolve, 200))
    const project = getProjectById(id)
    if (!project) {
      throw new Error(`Project with id ${id} not found`)
    }
    return project
  },

  // Trackers
  async getProjectTrackers(projectId: number, params: QueryParams & { query?: TrackerQuery } = {}): Promise<Tracker[]> {
    await new Promise(resolve => setTimeout(resolve, 250))
    
    const { limit = 50, offset = 0 } = params
    const trackers = getTrackersByProjectId(projectId)
    
    // Apply pagination
    return trackers.slice(offset, offset + limit)
  },

  async getTracker(id: number): Promise<Tracker> {
    await new Promise(resolve => setTimeout(resolve, 200))
    const tracker = mockTrackers.find(t => t.id === id)
    if (!tracker) {
      throw new Error(`Tracker with id ${id} not found`)
    }
    return tracker
  },

  // Artifacts
  async getTrackerArtifacts(trackerId: number, params: QueryParams & { query?: ArtifactQuery } = {}): Promise<Artifact[]> {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const { query, limit = 100, offset = 0 } = params
    let artifacts = getArtifactsByTrackerId(trackerId)
    
    // Apply search query
    if (query?.title && typeof query.title === 'string') {
      artifacts = searchArtifacts(query.title, trackerId)
    }
    
    // Apply status filter
    if (query?.status) {
      artifacts = artifacts.filter(artifact => 
        artifact.status?.toLowerCase() === query.status.toLowerCase()
      )
    }
    
    // Apply pagination
    return artifacts.slice(offset, offset + limit)
  },

  async getArtifact(id: number, params: QueryParams = {}): Promise<Artifact> {
    await new Promise(resolve => setTimeout(resolve, 200))
    const artifact = mockArtifacts.find(a => a.id === id)
    if (!artifact) {
      throw new Error(`Artifact with id ${id} not found`)
    }
    return artifact
  },

  async getArtifacts(ids: number[], params: QueryParams = {}): Promise<Artifact[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    const { limit = 100, offset = 0 } = params
    
    const artifacts = mockArtifacts.filter(artifact => ids.includes(artifact.id))
    return artifacts.slice(offset, offset + limit)
  },

  async getUserArtifacts(userId: string = 'self', query: string, params: QueryParams = {}): Promise<Artifact[]> {
    await new Promise(resolve => setTimeout(resolve, 350))
    const { limit = 100, offset = 0 } = params
    
    // For mock, return all artifacts assigned to user
    const userArtifacts = mockArtifacts.filter(artifact => 
      artifact.values?.some(value => 
        value.label.toLowerCase().includes('assigned') && 
        String(value.value).toLowerCase().includes('user')
      )
    )
    
    return userArtifacts.slice(offset, offset + limit)
  },

  // Helper methods for specific artifact types
  async getEpics(trackerId: number, params: QueryParams = {}): Promise<Artifact[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    const epicTrackers = mockTrackers.filter(t => t.label.includes('Epic'))
    const epicArtifacts = mockArtifacts.filter(artifact => 
      epicTrackers.some(tracker => tracker.id === artifact.tracker.id)
    )
    return epicArtifacts.slice(params.offset || 0, (params.offset || 0) + (params.limit || 100))
  },

  async getFeatures(trackerId: number, params: QueryParams = {}): Promise<Artifact[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    const featureTrackers = mockTrackers.filter(t => t.label.includes('Feature'))
    const featureArtifacts = mockArtifacts.filter(artifact => 
      featureTrackers.some(tracker => tracker.id === artifact.tracker.id)
    )
    return featureArtifacts.slice(params.offset || 0, (params.offset || 0) + (params.limit || 100))
  },

  async getTasks(trackerId: number, params: QueryParams = {}): Promise<Artifact[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    const taskTrackers = mockTrackers.filter(t => t.label.includes('Task'))
    const taskArtifacts = mockArtifacts.filter(artifact => 
      taskTrackers.some(tracker => tracker.id === artifact.tracker.id)
    )
    return taskArtifacts.slice(params.offset || 0, (params.offset || 0) + (params.limit || 100))
  },

  async getStories(trackerId: number, params: QueryParams = {}): Promise<Artifact[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    const storyTrackers = mockTrackers.filter(t => t.label.includes('Stories'))
    const storyArtifacts = mockArtifacts.filter(artifact => 
      storyTrackers.some(tracker => tracker.id === artifact.tracker.id)
    )
    return storyArtifacts.slice(params.offset || 0, (params.offset || 0) + (params.limit || 100))
  },

  // Epic-specific methods
  async getEpicById(id: number): Promise<Epic> {
    try {
      const response = await api.get(`/artifacts/${id}`)
      return this.transformArtifactToEpic(response.data)
    } catch (error: any) {
      console.error(`Error fetching epic ${id}:`, error)
      
      // If it's a 404, throw a more specific error
      if (error.response?.status === 404) {
        throw new Error(`Epic #${id} not found`)
      }
      
      // If it's an auth error, throw a more specific error  
      if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please check your API token.')
      }
      
      // If it's a network error, throw a more specific error
      if (!error.response) {
        throw new Error('Network error. Please check your connection.')
      }
      
      // For other errors, use the mock data as fallback for development
      console.warn(`Using mock data for epic ${id} due to API error`)
      const mockEpic = this.createMockEpic(id)
      return mockEpic
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
      const field = artifact.values?.find((v: TuleapArtifactValue) => v.label === 'Links')
      return field?.links || []
    }

    const categorizeLinks = (links: TuleapArtifactLink[]) => {
      const categories = {
        features: [] as TuleapArtifactLink[],
        stories: [] as TuleapArtifactLink[],
        tasks: [] as TuleapArtifactLink[],
        defects: [] as TuleapArtifactLink[]
      }

      links.forEach(link => {
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
      summary: artifact.values_by_field?.description?.value || 
               artifact.values_by_field?.description?.commonmark || 
               getFieldByLabel('Description'),
      leadTeam: getFieldByLabel('Lead Team'),
      estimation: artifact.values_by_field?.capacity?.value || getFieldValue(5687),
      remainingEffort: artifact.values_by_field?.remaining_effort?.value || getFieldValue(5688),
      lastUpdateDate: artifact.last_modified_date,
      htmlUrl: artifact.html_url || `https://tuleap-web.swmcloud.net/plugins/tracker/?aid=${artifact.id}`,
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

  createMockEpic(id: number): Epic {
    const mockEpics: Epic[] = [
      {
        id: 416725,
        title: '[SEGUR V2 DPI] Homologation simplifiée DMP 2.9',
        status: 'Development in progress',
        summary: 'Homologation simplifiée DMP 2.9 afin d\'inclure: L\'implémentation des transactions TD3.3a, TD3.3b et TD3.3d considérées comme obligatoires pour la vague 2 du SEGUR (validé par JMC), La mise à jour de la popup d\'autorisation de consultation',
        leadTeam: '🧩 Tribu ITO',
        estimation: 116,
        remainingEffort: 5,
        lastUpdateDate: '2025-07-11T09:55:34+02:00',
        htmlUrl: 'https://tuleap-web.swmcloud.net/plugins/tracker/?aid=416725',
        project: {
          id: 128,
          label: 'Softway Medical Program',
          icon: '🏢'
        },
        tracker: {
          id: 205,
          label: 'Epics',
          color: 'surf-green'
        },
        submittedBy: {
          id: 210,
          name: 'DEGRYSE William',
          username: 'wdegryse',
          avatar_url: 'https://tuleap-web.swmcloud.net/users/wdegryse/avatar-a010a23522629057e9b53234d760915e029318f70a062824d55e788926eb16bc.png'
        },
        links: {
          features: [],
          stories: [],
          tasks: [],
          defects: []
        },
        tags: ['SEGUR V2', 'pas de communication client'],
        expectedEndDate: '2025-06-18T00:00:00+02:00',
        realEndDate: '2025-06-18T00:00:00+02:00',
        expectedStartDate: '2025-03-10T00:00:00+01:00',
        realStartDate: '2025-03-10T00:00:00+01:00'
      }
    ]

    const mockEpic = mockEpics.find(e => e.id === id)
    if (mockEpic) {
      return mockEpic
    }

    // Create a generic mock epic for any ID
    return {
      id,
      title: `Mock Epic #${id}`,
      status: 'To Do',
      summary: `This is a mock epic with ID ${id} for development purposes.`,
      leadTeam: 'Development Team',
      estimation: 50,
      remainingEffort: 25,
      lastUpdateDate: new Date().toISOString(),
      htmlUrl: `https://tuleap-web.swmcloud.net/plugins/tracker/?aid=${id}`,
      project: {
        id: 1,
        label: 'Mock Project',
        icon: '🔧'
      },
      tracker: {
        id: 1,
        label: 'Epics',
        color: 'primary'
      },
      submittedBy: {
        id: 1,
        name: 'Mock User',
        username: 'mock_user'
      },
      links: {
        features: [],
        stories: [],
        tasks: [],
        defects: []
      },
      tags: ['Mock', 'Development']
    }
  },

  // Method to fetch related artifacts based on epic links
  async getRelatedArtifacts(epic: Epic): Promise<{
    features: TuleapArtifact[],
    stories: TuleapArtifact[],
    tasks: TuleapArtifact[],
    defects: TuleapArtifact[]
  }> {
    const results = {
      features: [] as TuleapArtifact[],
      stories: [] as TuleapArtifact[],
      tasks: [] as TuleapArtifact[],
      defects: [] as TuleapArtifact[]
    }

    if (!epic.links) return results

    // Fetch all related artifacts in parallel
    const allArtifactIds = [
      ...epic.links.features.map(link => link.id),
      ...epic.links.stories.map(link => link.id),
      ...epic.links.tasks.map(link => link.id),
      ...epic.links.defects.map(link => link.id)
    ]

    if (allArtifactIds.length === 0) return results

    try {
      const artifactPromises = allArtifactIds.map(id => api.get(`/artifacts/${id}`))
      const responses = await Promise.allSettled(artifactPromises)

      responses.forEach((response, index) => {
        if (response.status === 'fulfilled') {
          const artifact = response.value.data as TuleapArtifact
          const artifactId = allArtifactIds[index]
          
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
        }
      })
    } catch (error) {
      console.error('Error fetching related artifacts:', error)
    }

    return results
  }
}

export default api