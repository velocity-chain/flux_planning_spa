import { describe, it, expect, beforeEach, vi } from 'vitest'
import { api } from './client'
import type { OptimizationInput } from './types'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('API Client - Optimization Endpoints', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    localStorage.clear()
    localStorage.setItem('access_token', 'test-token')
  })

  it('should get all optimizations', async () => {
    const mockOptimizations = [
      {
        _id: '507f1f77bcf86cd799439011',
        name: 'test-optimization',
        description: 'Test description',
        status: 'active',
        created: {
          from_ip: '127.0.0.1',
          by_user: 'user1',
          at_time: '2024-01-01T00:00:00Z',
          correlation_id: 'corr-123'
        }
      }
    ]

    const mockResponse = {
      items: mockOptimizations,
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

    const result = await api.getOptimizations()

    expect(result).toEqual(mockResponse)
  })

  it('should get a single optimization', async () => {
    const mockOptimization = {
      _id: '507f1f77bcf86cd799439011',
      name: 'test-optimization',
      created: {
        from_ip: '127.0.0.1',
        by_user: 'user1',
        at_time: '2024-01-01T00:00:00Z',
        correlation_id: 'corr-123'
      }
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: (name: string) => name === 'content-length' ? '100' : null },
      json: async () => mockOptimization
    })

    const result = await api.getOptimization('507f1f77bcf86cd799439011')

    expect(result).toEqual(mockOptimization)
  })

  it('should create a optimization', async () => {
    const input: OptimizationInput = {
      name: 'new-optimization',
      description: 'New description',
      status: 'active'
    }

    const mockResponse = { _id: '507f1f77bcf86cd799439011' }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 201,
      headers: { get: (name: string) => name === 'content-length' ? '100' : null },
      json: async () => mockResponse
    })

    const result = await api.createOptimization(input)

    expect(result).toEqual(mockResponse)
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/optimization',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(input)
      })
    )
  })
})