import type { Project, Tracker, Artifact, ArtifactType } from '@/types/api'

export const mockProjects: Project[] = [
  {
    id: 1,
    uri: '/projects/1',
    label: 'E-Commerce Platform',
    shortname: 'ecommerce',
    description: 'Modern e-commerce platform with microservices architecture',
    status: 'active',
    is_public: false,
    access: 'private',
    icon: '🛒',
    additional_informations: [],
    resources: []
  },
  {
    id: 2,
    uri: '/projects/2',
    label: 'Mobile Banking App',
    shortname: 'mobile-banking',
    description: 'Secure mobile banking application with biometric authentication',
    status: 'active',
    is_public: false,
    access: 'private',
    icon: '💳',
    additional_informations: [],
    resources: []
  },
  {
    id: 3,
    uri: '/projects/3',
    label: 'Data Analytics Dashboard',
    shortname: 'analytics',
    description: 'Real-time data analytics and visualization platform',
    status: 'active',
    is_public: true,
    access: 'public',
    icon: '📊',
    additional_informations: [],
    resources: []
  },
  {
    id: 4,
    uri: '/projects/4',
    label: 'IoT Device Management',
    shortname: 'iot-mgmt',
    description: 'Centralized IoT device management and monitoring system',
    status: 'active',
    is_public: false,
    access: 'private',
    icon: '🔌',
    additional_informations: [],
    resources: []
  },
  {
    id: 5,
    uri: '/projects/5',
    label: 'Documentation Portal',
    shortname: 'docs',
    description: 'Company-wide documentation and knowledge base',
    status: 'active',
    is_public: true,
    access: 'public',
    icon: '📖',
    additional_informations: [],
    resources: []
  }
]

export const mockTrackers: Tracker[] = [
  {
    id: 101,
    uri: '/trackers/101',
    label: 'Epics',
    description: 'High-level user journeys and business objectives',
    item_name: 'Epic',
    color_name: '#9C27B0',
    project: {
      id: 1,
      uri: '/projects/1',
      label: 'E-Commerce Platform'
    }
  },
  {
    id: 102,
    uri: '/trackers/102',
    label: 'Features',
    description: 'Product features and capabilities',
    item_name: 'Feature',
    color_name: '#2196F3',
    project: {
      id: 1,
      uri: '/projects/1',
      label: 'E-Commerce Platform'
    }
  },
  {
    id: 103,
    uri: '/trackers/103',
    label: 'User Stories',
    description: 'User-focused requirements and acceptance criteria',
    item_name: 'Story',
    color_name: '#FF9800',
    project: {
      id: 1,
      uri: '/projects/1',
      label: 'E-Commerce Platform'
    }
  },
  {
    id: 104,
    uri: '/trackers/104',
    label: 'Tasks',
    description: 'Technical tasks and development work',
    item_name: 'Task',
    color_name: '#4CAF50',
    project: {
      id: 1,
      uri: '/projects/1',
      label: 'E-Commerce Platform'
    }
  },
  {
    id: 201,
    uri: '/trackers/201',
    label: 'Banking Features',
    description: 'Banking-specific features and services',
    item_name: 'Feature',
    color_name: '#2196F3',
    project: {
      id: 2,
      uri: '/projects/2',
      label: 'Mobile Banking App'
    }
  },
  {
    id: 202,
    uri: '/trackers/202',
    label: 'Security Stories',
    description: 'Security-related user stories and requirements',
    item_name: 'Story',
    color_name: '#F44336',
    project: {
      id: 2,
      uri: '/projects/2',
      label: 'Mobile Banking App'
    }
  }
]

export const mockArtifacts: Artifact[] = [
  {
    id: 1001,
    uri: '/artifacts/1001',
    tracker: {
      id: 101,
      uri: '/trackers/101',
      label: 'Epics'
    },
    project: {
      id: 1,
      uri: '/projects/1',
      label: 'E-Commerce Platform'
    },
    submitted_by: 1,
    submitted_on: '2024-01-15T09:00:00Z',
    last_update_date: '2024-01-20T14:30:00Z',
    title: 'Customer Shopping Journey',
    status: 'In Progress',
    values: [
      {
        field_id: 1,
        type: 'string',
        label: 'Title',
        value: 'Customer Shopping Journey',
        permissions: ['read', 'update']
      },
      {
        field_id: 2,
        type: 'string',
        label: 'Status',
        value: 'In Progress',
        permissions: ['read', 'update']
      },
      {
        field_id: 3,
        type: 'text',
        label: 'Description',
        value: 'Enable customers to browse, search, and purchase products seamlessly',
        permissions: ['read', 'update']
      },
      {
        field_id: 4,
        type: 'int',
        label: 'Story Points',
        value: 21,
        permissions: ['read', 'update']
      }
    ]
  },
  {
    id: 1002,
    uri: '/artifacts/1002',
    tracker: {
      id: 102,
      uri: '/trackers/102',
      label: 'Features'
    },
    project: {
      id: 1,
      uri: '/projects/1',
      label: 'E-Commerce Platform'
    },
    submitted_by: 1,
    submitted_on: '2024-01-16T10:00:00Z',
    last_update_date: '2024-01-22T11:15:00Z',
    title: 'Product Search and Filtering',
    status: 'Done',
    values: [
      {
        field_id: 1,
        type: 'string',
        label: 'Title',
        value: 'Product Search and Filtering',
        permissions: ['read', 'update']
      },
      {
        field_id: 2,
        type: 'string',
        label: 'Status',
        value: 'Done',
        permissions: ['read', 'update']
      },
      {
        field_id: 3,
        type: 'text',
        label: 'Description',
        value: 'Advanced search with filters for category, price, brand, and ratings',
        permissions: ['read', 'update']
      },
      {
        field_id: 4,
        type: 'int',
        label: 'Story Points',
        value: 8,
        permissions: ['read', 'update']
      }
    ]
  },
  {
    id: 1003,
    uri: '/artifacts/1003',
    tracker: {
      id: 103,
      uri: '/trackers/103',
      label: 'User Stories'
    },
    project: {
      id: 1,
      uri: '/projects/1',
      label: 'E-Commerce Platform'
    },
    submitted_by: 2,
    submitted_on: '2024-01-17T11:30:00Z',
    last_update_date: '2024-01-23T16:45:00Z',
    title: 'As a customer, I want to add items to my cart',
    status: 'In Progress',
    values: [
      {
        field_id: 1,
        type: 'string',
        label: 'Title',
        value: 'As a customer, I want to add items to my cart',
        permissions: ['read', 'update']
      },
      {
        field_id: 2,
        type: 'string',
        label: 'Status',
        value: 'In Progress',
        permissions: ['read', 'update']
      },
      {
        field_id: 3,
        type: 'text',
        label: 'Description',
        value: 'Allow customers to add products to their shopping cart for later purchase',
        permissions: ['read', 'update']
      },
      {
        field_id: 4,
        type: 'int',
        label: 'Story Points',
        value: 3,
        permissions: ['read', 'update']
      },
      {
        field_id: 5,
        type: 'string',
        label: 'Priority',
        value: 'High',
        permissions: ['read', 'update']
      }
    ]
  },
  {
    id: 1004,
    uri: '/artifacts/1004',
    tracker: {
      id: 104,
      uri: '/trackers/104',
      label: 'Tasks'
    },
    project: {
      id: 1,
      uri: '/projects/1',
      label: 'E-Commerce Platform'
    },
    submitted_by: 3,
    submitted_on: '2024-01-18T13:00:00Z',
    last_update_date: '2024-01-24T09:30:00Z',
    title: 'Implement shopping cart API endpoints',
    status: 'To Do',
    values: [
      {
        field_id: 1,
        type: 'string',
        label: 'Title',
        value: 'Implement shopping cart API endpoints',
        permissions: ['read', 'update']
      },
      {
        field_id: 2,
        type: 'string',
        label: 'Status',
        value: 'To Do',
        permissions: ['read', 'update']
      },
      {
        field_id: 3,
        type: 'text',
        label: 'Description',
        value: 'Create REST API endpoints for cart operations: add, remove, update, clear',
        permissions: ['read', 'update']
      },
      {
        field_id: 4,
        type: 'int',
        label: 'Story Points',
        value: 5,
        permissions: ['read', 'update']
      },
      {
        field_id: 5,
        type: 'string',
        label: 'Assigned To',
        value: 'John Doe',
        permissions: ['read', 'update']
      }
    ]
  },
  {
    id: 2001,
    uri: '/artifacts/2001',
    tracker: {
      id: 201,
      uri: '/trackers/201',
      label: 'Banking Features'
    },
    project: {
      id: 2,
      uri: '/projects/2',
      label: 'Mobile Banking App'
    },
    submitted_by: 1,
    submitted_on: '2024-01-19T08:00:00Z',
    last_update_date: '2024-01-25T12:00:00Z',
    title: 'Biometric Authentication',
    status: 'In Progress',
    values: [
      {
        field_id: 1,
        type: 'string',
        label: 'Title',
        value: 'Biometric Authentication',
        permissions: ['read', 'update']
      },
      {
        field_id: 2,
        type: 'string',
        label: 'Status',
        value: 'In Progress',
        permissions: ['read', 'update']
      },
      {
        field_id: 3,
        type: 'text',
        label: 'Description',
        value: 'Implement fingerprint and face recognition for secure login',
        permissions: ['read', 'update']
      },
      {
        field_id: 4,
        type: 'int',
        label: 'Story Points',
        value: 13,
        permissions: ['read', 'update']
      }
    ]
  }
]

// Helper functions for mock data
export const getProjectById = (id: number): Project | undefined => {
  return mockProjects.find(project => project.id === id)
}

export const getTrackersByProjectId = (projectId: number): Tracker[] => {
  return mockTrackers.filter(tracker => tracker.project.id === projectId)
}

export const getArtifactsByTrackerId = (trackerId: number): Artifact[] => {
  return mockArtifacts.filter(artifact => artifact.tracker.id === trackerId)
}

export const getArtifactsByType = (type: ArtifactType): Artifact[] => {
  const typeMap: Record<ArtifactType, string[]> = {
    epic: ['Epics'],
    feature: ['Features', 'Banking Features'],
    story: ['User Stories', 'Security Stories'],
    task: ['Tasks']
  }
  
  const trackerLabels = typeMap[type] || []
  return mockArtifacts.filter(artifact => 
    trackerLabels.includes(artifact.tracker.label)
  )
}

export const searchProjects = (query: string): Project[] => {
  const searchTerm = query.toLowerCase()
  return mockProjects.filter(project => 
    project.label.toLowerCase().includes(searchTerm) ||
    project.shortname.toLowerCase().includes(searchTerm) ||
    project.description.toLowerCase().includes(searchTerm)
  )
}

export const searchArtifacts = (query: string, trackerId?: number): Artifact[] => {
  const searchTerm = query.toLowerCase()
  const artifacts = trackerId ? getArtifactsByTrackerId(trackerId) : mockArtifacts
  
  return artifacts.filter(artifact => 
    artifact.title?.toLowerCase().includes(searchTerm) ||
    artifact.values?.some(value => 
      String(value.value).toLowerCase().includes(searchTerm)
    )
  )
}