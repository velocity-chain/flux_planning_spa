import { describe, it, expect, beforeEach, vi } from 'vitest'
import { api } from './client'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('API Client - Organization Endpoints', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    localStorage.clear()
    localStorage.setItem('access_token', 'test-token')
  })

  it('should get all organizations', async () => {
    const mockOrganizations = [
      {
        _id: '507f1f77bcf86cd799439011',
        name: 'test-organization',
        description: 'Test description',
        status: 'active'
      }
    ]

    const mockResponse = {
      items: mockOrganizations,
      limit: 20,
      has_more: false,
      next_cursor: null
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: (name: string) => name === 'content-length' ? '100' : null },
      json: async () => mockResponse
    })

    const result = await api.getOrganizations()

    expect(result).toEqual(mockResponse)
  })

  it('should get organizations with name query', async () => {
    const mockResponse = {
      items: [],
      limit: 20,
      has_more: false,
      next_cursor: null
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: (name: string) => name === 'content-length' ? '100' : null },
      json: async () => mockResponse
    })

    await api.getOrganizations({ name: 'test' })

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/organization?name=test',
      expect.any(Object)
    )
  })

  it('should get a single organization', async () => {
    const mockOrganization = {
      _id: '507f1f77bcf86cd799439011',
      name: 'test-organization'
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: (name: string) => name === 'content-length' ? '100' : null },
      json: async () => mockOrganization
    })

    const result = await api.getOrganization('507f1f77bcf86cd799439011')

    expect(result).toEqual(mockOrganization)
  })
})