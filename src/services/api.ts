import axios from 'axios'
import type { 
  Project, 
  Tracker, 
  Artifact, 
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
  baseURL: import.meta.env.VITE_API_URL || 'https://tuleap.net/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tuleap_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
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
  }
}

export default api