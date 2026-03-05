// Type definitions based on OpenAPI spec

export interface Error {
  error: string
}

export interface Breadcrumb {
  from_ip: string
  by_user: string
  at_time: string
  correlation_id: string
}


// Scenario Domain
export interface Scenario {
  _id: string
  name: string
  description?: string
  status?: 'active' | 'archived'
  created: Breadcrumb
  saved: Breadcrumb
}

export interface ScenarioInput {
  name: string
  description?: string
  status?: 'active' | 'archived'
}

export interface ScenarioUpdate {
  name?: string
  description?: string
  status?: 'active' | 'archived'
}

// Demand Domain
export interface Demand {
  _id: string
  name: string
  description?: string
  status?: 'active' | 'archived'
  created: Breadcrumb
  saved: Breadcrumb
}

export interface DemandInput {
  name: string
  description?: string
  status?: 'active' | 'archived'
}

export interface DemandUpdate {
  name?: string
  description?: string
  status?: 'active' | 'archived'
}


// Optimization Domain
export interface Optimization {
  _id: string
  name: string
  description?: string
  status?: string
  created: Breadcrumb
}

export interface OptimizationInput {
  name: string
  description?: string
  status?: string
}


// Organization Domain
export interface Organization {
  _id: string
  name: string
  description?: string
  status?: string
}

// Product Domain
export interface Product {
  _id: string
  name: string
  description?: string
  status?: string
}

// Supplier Domain
export interface Supplier {
  _id: string
  name: string
  description?: string
  status?: string
}

// Analytics Domain
export interface Analytics {
  _id: string
  name: string
  description?: string
  status?: string
}


// Authentication
export interface DevLoginRequest {
  subject?: string
  roles?: string[]
}

export interface DevLoginResponse {
  access_token: string
  token_type: string
  expires_at: string
  subject: string
  roles: string[]
}

// Configuration
export interface ConfigResponse {
  config_items: unknown[]
  versions: unknown[]
  enumerators: unknown[]
  token?: {
    claims?: Record<string, unknown>
  }
}

// Infinite Scroll
export interface InfiniteScrollParams {
  name?: string
  after_id?: string
  limit?: number
  sort_by?: string
  order?: 'asc' | 'desc'
}

export interface InfiniteScrollResponse<T> {
  items: T[]
  limit: number
  has_more: boolean
  next_cursor: string | null
}
