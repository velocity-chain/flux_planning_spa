import type { 
  Scenario,
  ScenarioInput,
  ScenarioUpdate,

  Demand,
  DemandInput,
  DemandUpdate,

  Optimization,
  OptimizationInput,

  Organization,

  Product,

  Supplier,

  Analytics,

  DevLoginRequest, 
  DevLoginResponse,
  ConfigResponse,
  Error,
  InfiniteScrollParams,
  InfiniteScrollResponse
} from './types'

const API_BASE = '/api'

function getDevLoginUrl(): string {
  return '/dev-login'
}

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: Error
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('access_token')
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    let errorData: Error | null = null
    try {
      errorData = await response.json()
    } catch {
      // Ignore JSON parse errors
    }
    
    // Handle 401 Unauthorized - clear invalid token and redirect to login
    if (response.status === 401) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('token_expires_at')
      // Redirect to login page, preserving current path for post-login redirect
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`
    }
    
    throw new ApiError(
      errorData?.error || `HTTP ${response.status}: ${response.statusText}`,
      response.status,
      errorData || undefined
    )
  }

  // Handle empty responses
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return {} as T
  }

  return response.json()
}

export const api = {
  // Authentication
  async devLogin(payload?: DevLoginRequest): Promise<DevLoginResponse> {
    const url = getDevLoginUrl()
    const token = localStorage.getItem('access_token')
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload || {}),
    })

    if (!response.ok) {
      let errorData: Error | null = null
      try {
        errorData = await response.json()
      } catch {
        // Ignore JSON parse errors
      }
      throw new ApiError(
        errorData?.error || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData || undefined
      )
    }

    return response.json()
  },

  // Config
  async getConfig(): Promise<ConfigResponse> {
    return request<ConfigResponse>('/config')
  },

  // Control endpoints
  // 🎯 API methods use InfiniteScrollParams and InfiniteScrollResponse types
  // These types are compatible with spa_utils useInfiniteScroll composable

  async getScenarios(params?: InfiniteScrollParams): Promise<InfiniteScrollResponse<Scenario>> {
    const queryParams = new URLSearchParams()
    if (params?.name) queryParams.append('name', params.name)
    if (params?.after_id) queryParams.append('after_id', params.after_id)
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by)
    if (params?.order) queryParams.append('order', params.order)
    
    const query = queryParams.toString()
    return request<InfiniteScrollResponse<Scenario>>(`/scenario${query ? `?${query}` : ''}`)
  },

  async getScenario(scenarioId: string): Promise<Scenario> {
    return request<Scenario>(`/scenario/${scenarioId}`)
  },

  async createScenario(data: ScenarioInput): Promise<{ _id: string }> {
    return request<{ _id: string }>('/scenario', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async updateScenario(scenarioId: string, data: ScenarioUpdate): Promise<Scenario> {
    return request<Scenario>(`/scenario/${scenarioId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },


  async getDemands(params?: InfiniteScrollParams): Promise<InfiniteScrollResponse<Demand>> {
    const queryParams = new URLSearchParams()
    if (params?.name) queryParams.append('name', params.name)
    if (params?.after_id) queryParams.append('after_id', params.after_id)
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by)
    if (params?.order) queryParams.append('order', params.order)
    
    const query = queryParams.toString()
    return request<InfiniteScrollResponse<Demand>>(`/demand${query ? `?${query}` : ''}`)
  },

  async getDemand(demandId: string): Promise<Demand> {
    return request<Demand>(`/demand/${demandId}`)
  },

  async createDemand(data: DemandInput): Promise<{ _id: string }> {
    return request<{ _id: string }>('/demand', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async updateDemand(demandId: string, data: DemandUpdate): Promise<Demand> {
    return request<Demand>(`/demand/${demandId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },



  // Create endpoints

  async getOptimizations(params?: InfiniteScrollParams): Promise<InfiniteScrollResponse<Optimization>> {
    const queryParams = new URLSearchParams()
    if (params?.name) queryParams.append('name', params.name)
    if (params?.after_id) queryParams.append('after_id', params.after_id)
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by)
    if (params?.order) queryParams.append('order', params.order)
    
    const query = queryParams.toString()
    return request<InfiniteScrollResponse<Optimization>>(`/optimization${query ? `?${query}` : ''}`)
  },

  async getOptimization(optimizationId: string): Promise<Optimization> {
    return request<Optimization>(`/optimization/${optimizationId}`)
  },

  async createOptimization(data: OptimizationInput): Promise<{ _id: string }> {
    return request<{ _id: string }>('/optimization', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },



  // Consume endpoints

  async getOrganizations(params?: InfiniteScrollParams): Promise<InfiniteScrollResponse<Organization>> {
    const queryParams = new URLSearchParams()
    if (params?.name) queryParams.append('name', params.name)
    if (params?.after_id) queryParams.append('after_id', params.after_id)
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by)
    if (params?.order) queryParams.append('order', params.order)
    
    const query = queryParams.toString()
    return request<InfiniteScrollResponse<Organization>>(`/organization${query ? `?${query}` : ''}`)
  },

  async getOrganization(organizationId: string): Promise<Organization> {
    return request<Organization>(`/organization/${organizationId}`)
  },


  async getProducts(params?: InfiniteScrollParams): Promise<InfiniteScrollResponse<Product>> {
    const queryParams = new URLSearchParams()
    if (params?.name) queryParams.append('name', params.name)
    if (params?.after_id) queryParams.append('after_id', params.after_id)
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by)
    if (params?.order) queryParams.append('order', params.order)
    
    const query = queryParams.toString()
    return request<InfiniteScrollResponse<Product>>(`/product${query ? `?${query}` : ''}`)
  },

  async getProduct(productId: string): Promise<Product> {
    return request<Product>(`/product/${productId}`)
  },


  async getSuppliers(params?: InfiniteScrollParams): Promise<InfiniteScrollResponse<Supplier>> {
    const queryParams = new URLSearchParams()
    if (params?.name) queryParams.append('name', params.name)
    if (params?.after_id) queryParams.append('after_id', params.after_id)
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by)
    if (params?.order) queryParams.append('order', params.order)
    
    const query = queryParams.toString()
    return request<InfiniteScrollResponse<Supplier>>(`/supplier${query ? `?${query}` : ''}`)
  },

  async getSupplier(supplierId: string): Promise<Supplier> {
    return request<Supplier>(`/supplier/${supplierId}`)
  },


  async getAnalyticss(params?: InfiniteScrollParams): Promise<InfiniteScrollResponse<Analytics>> {
    const queryParams = new URLSearchParams()
    if (params?.name) queryParams.append('name', params.name)
    if (params?.after_id) queryParams.append('after_id', params.after_id)
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by)
    if (params?.order) queryParams.append('order', params.order)
    
    const query = queryParams.toString()
    return request<InfiniteScrollResponse<Analytics>>(`/analytics${query ? `?${query}` : ''}`)
  },

  async getAnalytics(analyticsId: string): Promise<Analytics> {
    return request<Analytics>(`/analytics/${analyticsId}`)
  },


}

export { ApiError }
