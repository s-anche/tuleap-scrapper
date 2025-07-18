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

export interface TuleapArtifactLink {
  id: number
  uri: string
  tracker: {
    id: number
    uri: string
    label: string
    color: string
    project: {
      id: number
      uri: string
      label: string
      icon: string
    }
  }
  type: string
}

export interface TuleapArtifactValue {
  field_id: number
  label: string
  type: string
  value?: any
  values?: any[]
  links?: TuleapArtifactLink[]
  reverse_links?: TuleapArtifactLink[]
  bind_value_ids?: any[]
  bind_value_objects?: any[]
  format?: string
  commonmark?: string
  post_processed_value?: any
  is_autocomputed?: boolean
  manual_value?: any
  is_time_displayed?: boolean
  file_descriptions?: any[]
}

export interface TuleapArtifact {
  id: number
  uri: string
  xref: string
  tracker: {
    id: number
    uri: string
    label: string
    color_name: string
    project: {
      id: number
      uri: string
      label: string
      icon: string
    }
    cannot_create_reasons?: string[]
  }
  project: {
    id: number
    uri: string
    label: string
    icon: string
  }
  submitted_by: number
  submitted_by_user: {
    id: number
    uri: string
    user_url: string
    real_name: string
    display_name: string
    username: string
    ldap_id: string
    avatar_url: string
    is_anonymous: boolean
    has_avatar: boolean
    email?: string
    status?: string
  }
  submitted_on: string
  html_url: string
  changesets_uri: string
  values: TuleapArtifactValue[]
  values_by_field: {
    [key: string]: TuleapArtifactValue
  }
  last_modified_date: string
  status: string
  full_status: {
    value: string
    color: string
  }
  is_open: boolean
  title: string
  assignees: any[]
}

export interface Epic {
  id: number
  title: string
  status: string
  summary?: string
  leadTeam?: string
  estimation?: number
  remainingEffort?: number
  lastUpdateDate: string
  htmlUrl: string
  project: {
    id: number
    label: string
    icon?: string
  }
  tracker: {
    id: number
    label: string
    color?: string
  }
  submittedBy?: {
    id: number
    name: string
    username: string
    avatar_url?: string
  }
  links?: {
    features: TuleapArtifactLink[]
    stories: TuleapArtifactLink[]
    tasks: TuleapArtifactLink[]
    defects: TuleapArtifactLink[]
  }
  tags?: string[]
  expectedEndDate?: string
  realEndDate?: string
  expectedStartDate?: string
  realStartDate?: string
}

export interface EpicTreeFeature {
  artifact: TuleapArtifact
  subArtifacts: TuleapArtifact[]
  points: number | null
  remainingEffort: number | null
  linkedArtifactCount: number
  percentWithPoints: number
}

export interface EpicTreeData {
  features: EpicTreeFeature[]
  directStories: TuleapArtifact[]
  directTasks: TuleapArtifact[]
  defects: TuleapArtifact[]
}

export interface TreeNode {
  id: string
  title: string
  children?: TreeNode[]
  type: 'epic' | 'feature' | 'story' | 'task' | 'defect'
  artifact?: TuleapArtifact
  status?: string
  points?: number | null
  remainingEffort?: number | null
  sprint?: string | null
  linkedArtifactCount?: number
  percentWithPoints?: number
  htmlUrl?: string
}

export interface ArtifactMetrics {
  points: number | null
  remainingEffort: number | null
  sprint: string | null
  status: string
  htmlUrl: string
}