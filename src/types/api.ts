export interface Project {
  id: number
  uri: string
  label: string
  shortname: string
  description: string
  status: string
  is_public: boolean
  access: string
  icon: string
  additional_informations: any[]
  resources: any[]
}

export interface Tracker {
  id: number
  uri: string
  label: string
  description: string
  item_name: string
  color_name: string
  project: {
    id: number
    uri: string
    label: string
  }
  workflow?: any
  fields?: TrackerField[]
  semantics?: any
  structure?: any
  cannot_create_reasons?: string[]
}

export interface TrackerField {
  field_id: number
  label: string
  name: string
  type: string
  required: boolean
  values?: any[]
  bind?: any
  permissions?: string[]
}

export interface Artifact {
  id: number
  uri: string
  tracker: {
    id: number
    uri: string
    label: string
  }
  project: {
    id: number
    uri: string
    label: string
  }
  submitted_by: number
  submitted_on: string
  last_update_date: string
  values?: ArtifactValue[]
  title?: string
  status?: string
  assigned_to?: any[]
  changesets?: any[]
  attachments?: any[]
  links?: any[]
}

export interface ArtifactValue {
  field_id: number
  type: string
  label: string
  value: any
  post_processed_value?: any
  is_autocomputed?: boolean
  has_changes?: boolean
  permissions?: string[]
}

export interface ApiResponse<T> {
  data?: T
  collection?: T[]
  total_size?: number
  size?: number
  limit?: number
  offset?: number
}

export interface QueryParams {
  limit?: number
  offset?: number
  values?: string
  expert_query?: string
  order?: 'asc' | 'desc'
  representation?: 'full' | 'minimal'
}

export interface ProjectQuery {
  shortname?: string
  is_member_of?: boolean
  is_admin_of?: boolean
  is_tracker_admin?: boolean
  with_status?: string
  with_time_tracking?: boolean
}

export interface TrackerQuery {
  is_tracker_admin?: boolean
  with_time_tracking?: boolean
  with_creation_semantic_check?: boolean
}

export interface ArtifactQuery {
  [key: string]: any
  id?: number[]
  title?: string | {
    operator: string
    value: string
  }
}

export enum ArtifactType {
  Epic = 'epic',
  Feature = 'feature',
  Task = 'task',
  Story = 'story'
}