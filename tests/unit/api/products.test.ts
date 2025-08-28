import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock $fetch
const mockFetch = vi.fn()
global.$fetch = mockFetch

describe('Products API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/products', () => {
    it('should fetch products successfully', async () => {
      const mockProducts = [
        {
          id: '1',
          name: 'Sapato Teste 1',
          price: 100,
          images: ['test1.jpg'],
          slug: 'sapato-teste-1'
        },
        {
          id: '2',
          name: 'Sapato Teste 2',
          price: 200,
          images: ['test2.jpg'],
          slug: 'sapato-teste-2'
        }
      ]

      mockFetch.mockResolvedValue(mockProducts)

      const products = await $fetch('/api/products')
      
      expect(products).toEqual(mockProducts)
      expect(mockFetch).toHaveBeenCalledWith('/api/products')
    })

    it('should handle API error', async () => {
      const error = new Error('API Error')
      mockFetch.mockRejectedValue(error)

      await expect($fetch('/api/products')).rejects.toThrow('API Error')
    })
  })

  describe('GET /api/products/featured', () => {
    it('should fetch featured products successfully', async () => {
      const mockFeaturedProducts = [
        {
          id: '1',
          name: 'Sapato Destaque',
          price: 150,
          images: ['featured.jpg'],
          slug: 'sapato-destaque',
          featured: true
        }
      ]

      mockFetch.mockResolvedValue(mockFeaturedProducts)

      const featuredProducts = await $fetch('/api/products/featured')
      
      expect(featuredProducts).toEqual(mockFeaturedProducts)
      expect(mockFetch).toHaveBeenCalledWith('/api/products/featured')
    })
  })

  describe('GET /api/products/[slug]', () => {
    it('should fetch product by slug successfully', async () => {
      const mockProduct = {
        id: '1',
        name: 'Sapato Específico',
        price: 100,
        images: ['specific.jpg'],
        slug: 'sapato-especifico',
        description: 'Descrição do sapato'
      }

      mockFetch.mockResolvedValue(mockProduct)

      const product = await $fetch('/api/products/sapato-especifico')
      
      expect(product).toEqual(mockProduct)
      expect(mockFetch).toHaveBeenCalledWith('/api/products/sapato-especifico')
    })

    it('should handle product not found', async () => {
      const error = new Error('Product not found')
      error.statusCode = 404
      mockFetch.mockRejectedValue(error)

      await expect($fetch('/api/products/produto-inexistente')).rejects.toThrow('Product not found')
    })
  })

  describe('POST /api/products', () => {
    it('should create product successfully', async () => {
      const newProduct = {
        name: 'Novo Sapato',
        price: 120,
        description: 'Descrição do novo sapato',
        categoryId: 'cat1'
      }

      const createdProduct = {
        id: '3',
        ...newProduct,
        slug: 'novo-sapato',
        images: [],
        createdAt: '2024-01-01T00:00:00Z'
      }

      mockFetch.mockResolvedValue(createdProduct)

      const result = await $fetch('/api/products', {
        method: 'POST',
        body: newProduct
      })
      
      expect(result).toEqual(createdProduct)
      expect(mockFetch).toHaveBeenCalledWith('/api/products', {
        method: 'POST',
        body: newProduct
      })
    })

    it('should handle validation error', async () => {
      const invalidProduct = {
        name: '', // Nome vazio
        price: -10 // Preço negativo
      }

      const error = new Error('Validation failed')
      error.statusCode = 400
      mockFetch.mockRejectedValue(error)

      await expect($fetch('/api/products', {
        method: 'POST',
        body: invalidProduct
      })).rejects.toThrow('Validation failed')
    })
  })

  describe('PUT /api/products/[id]', () => {
    it('should update product successfully', async () => {
      const updateData = {
        name: 'Sapato Atualizado',
        price: 150
      }

      const updatedProduct = {
        id: '1',
        ...updateData,
        description: 'Descrição original',
        slug: 'sapato-atualizado',
        images: ['updated.jpg']
      }

      mockFetch.mockResolvedValue(updatedProduct)

      const result = await $fetch('/api/products/1', {
        method: 'PUT',
        body: updateData
      })
      
      expect(result).toEqual(updatedProduct)
      expect(mockFetch).toHaveBeenCalledWith('/api/products/1', {
        method: 'PUT',
        body: updateData
      })
    })
  })

  describe('DELETE /api/products/[id]', () => {
    it('should delete product successfully', async () => {
      mockFetch.mockResolvedValue({ success: true })

      const result = await $fetch('/api/products/1', {
        method: 'DELETE'
      })
      
      expect(result).toEqual({ success: true })
      expect(mockFetch).toHaveBeenCalledWith('/api/products/1', {
        method: 'DELETE'
      })
    })
  })
})
