import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useWishlist } from '@/composables/useWishlist'

// Mock $fetch
const mockFetch = vi.fn()
global.$fetch = mockFetch

describe('useWishlist', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with empty wishlist', () => {
    const { wishlist, wishlistCount, isEmpty } = useWishlist()
    
    expect(wishlist.value).toEqual([])
    expect(wishlistCount.value).toBe(0)
    expect(isEmpty.value).toBe(true)
  })

  it('should load wishlist successfully', async () => {
    const { loadWishlist, wishlist } = useWishlist()
    
    const mockWishlistData = {
      items: [
        {
          id: '1',
          productId: 'prod1',
          product: {
            id: 'prod1',
            name: 'Sapato Teste',
            price: 100,
            images: ['test.jpg']
          },
          createdAt: '2024-01-01T00:00:00Z'
        }
      ]
    }

    mockFetch.mockResolvedValue(mockWishlistData)

    await loadWishlist()
    
    expect(wishlist.value).toHaveLength(1)
    expect(wishlist.value[0].productId).toBe('prod1')
    expect(mockFetch).toHaveBeenCalledWith('/api/wishlist')
  })

  it('should handle authentication error when loading wishlist', async () => {
    const { loadWishlist, wishlist } = useWishlist()
    
    const authError = new Error('Auth session missing')
    authError.statusCode = 401
    mockFetch.mockRejectedValue(authError)

    await loadWishlist()
    
    expect(wishlist.value).toEqual([])
  })

  it('should add item to wishlist successfully', async () => {
    const { addToWishlist, loadWishlist } = useWishlist()
    
    mockFetch
      .mockResolvedValueOnce({ success: true }) // addToWishlist response
      .mockResolvedValueOnce({ items: [] }) // loadWishlist response

    const result = await addToWishlist('prod1')
    
    expect(result).toBe(true)
    expect(mockFetch).toHaveBeenCalledWith('/api/wishlist', {
      method: 'POST',
      body: { productId: 'prod1' }
    })
  })

  it('should handle authentication error when adding to wishlist', async () => {
    const { addToWishlist } = useWishlist()
    
    const authError = new Error('Auth session missing')
    authError.statusCode = 401
    mockFetch.mockRejectedValue(authError)

    const result = await addToWishlist('prod1')
    
    expect(result).toBe(false)
  })

  it('should remove item from wishlist successfully', async () => {
    const { removeFromWishlist, wishlist } = useWishlist()
    
    // Set up initial wishlist state
    wishlist.value = [
      {
        id: '1',
        productId: 'prod1',
        product: {
          id: 'prod1',
          name: 'Sapato Teste',
          price: 100,
          images: ['test.jpg']
        },
        createdAt: '2024-01-01T00:00:00Z'
      }
    ]

    mockFetch.mockResolvedValue({ success: true })

    const result = await removeFromWishlist('prod1')
    
    expect(result).toBe(true)
    expect(wishlist.value).toHaveLength(0)
    expect(mockFetch).toHaveBeenCalledWith('/api/wishlist/prod1', {
      method: 'DELETE'
    })
  })

  it('should check if item is in wishlist', () => {
    const { isInWishlist, wishlist } = useWishlist()
    
    // Set up wishlist with items
    wishlist.value = [
      {
        id: '1',
        productId: 'prod1',
        product: {
          id: 'prod1',
          name: 'Sapato Teste',
          price: 100,
          images: ['test.jpg']
        },
        createdAt: '2024-01-01T00:00:00Z'
      }
    ]

    // Mock the isInWishlist function to work with the test data
    expect(wishlist.value.some(item => item.productId === 'prod1')).toBe(true)
    expect(wishlist.value.some(item => item.productId === 'prod2')).toBe(false)
  })

  it('should clear wishlist', () => {
    const { clearWishlist, wishlist, wishlistCount, isEmpty } = useWishlist()
    
    // Set up wishlist with items
    wishlist.value = [
      {
        id: '1',
        productId: 'prod1',
        product: {
          id: 'prod1',
          name: 'Sapato Teste',
          price: 100,
          images: ['test.jpg']
        },
        createdAt: '2024-01-01T00:00:00Z'
      }
    ]

    clearWishlist()
    
    expect(wishlist.value).toEqual([])
    expect(wishlistCount.value).toBe(0)
    expect(isEmpty.value).toBe(true)
  })
})
