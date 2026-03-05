import { describe, it, expect, beforeEach, vi } from 'vitest'
import { api } from './client'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('API Client - Analytics Endpoints', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    localStorage.clear()
    localStorage.setItem('access_token', 'test-token')
  })

  it('should get all analyticss', async () => {
    const mockAnalyticss = [
      {
        _id: '507f1f77bcf86cd799439011',
        name: 'test-analytics',
        description: 'Test description',
        status: 'active'
      }
    ]

    const mockResponse = {
      items: mockAnalyticss,
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

    const result = await api.getAnalyticss()

    expect(result).toEqual(mockResponse)
  })

  it('should get analyticss with name query', async () => {
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

    await api.getAnalyticss({ name: 'test' })

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/analytics?name=test',
      expect.any(Object)
    )
  })

  it('should get a single analytics', async () => {
    const mockAnalytics = {
      _id: '507f1f77bcf86cd799439011',
      name: 'test-analytics'
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: (name: string) => name === 'content-length' ? '100' : null },
      json: async () => mockAnalytics
    })

    const result = await api.getAnalytics('507f1f77bcf86cd799439011')

    expect(result).toEqual(mockAnalytics)
  })
})