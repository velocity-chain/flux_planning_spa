import { describe, it, expect, beforeEach, vi } from 'vitest'
import { api } from './client'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('API Client - Product Endpoints', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    localStorage.clear()
    localStorage.setItem('access_token', 'test-token')
  })

  it('should get all products', async () => {
    const mockProducts = [
      {
        _id: '507f1f77bcf86cd799439011',
        name: 'test-product',
        description: 'Test description',
        status: 'active'
      }
    ]

    const mockResponse = {
      items: mockProducts,
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

    const result = await api.getProducts()

    expect(result).toEqual(mockResponse)
  })

  it('should get products with name query', async () => {
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

    await api.getProducts({ name: 'test' })

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/product?name=test',
      expect.any(Object)
    )
  })

  it('should get a single product', async () => {
    const mockProduct = {
      _id: '507f1f77bcf86cd799439011',
      name: 'test-product'
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: (name: string) => name === 'content-length' ? '100' : null },
      json: async () => mockProduct
    })

    const result = await api.getProduct('507f1f77bcf86cd799439011')

    expect(result).toEqual(mockProduct)
  })
})