import { describe, it, expect, beforeEach, vi } from 'vitest'
import { api } from './client'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('API Client - Supplier Endpoints', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    localStorage.clear()
    localStorage.setItem('access_token', 'test-token')
  })

  it('should get all suppliers', async () => {
    const mockSuppliers = [
      {
        _id: '507f1f77bcf86cd799439011',
        name: 'test-supplier',
        description: 'Test description',
        status: 'active'
      }
    ]

    const mockResponse = {
      items: mockSuppliers,
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

    const result = await api.getSuppliers()

    expect(result).toEqual(mockResponse)
  })

  it('should get suppliers with name query', async () => {
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

    await api.getSuppliers({ name: 'test' })

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/supplier?name=test',
      expect.any(Object)
    )
  })

  it('should get a single supplier', async () => {
    const mockSupplier = {
      _id: '507f1f77bcf86cd799439011',
      name: 'test-supplier'
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: (name: string) => name === 'content-length' ? '100' : null },
      json: async () => mockSupplier
    })

    const result = await api.getSupplier('507f1f77bcf86cd799439011')

    expect(result).toEqual(mockSupplier)
  })
})