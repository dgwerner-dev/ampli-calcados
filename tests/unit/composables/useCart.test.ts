import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useCart } from '@/composables/useCart'

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}

Object.defineProperty(global, 'localStorage', {
  value: mockLocalStorage
})

describe('useCart', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockLocalStorage.getItem.mockReturnValue(null)
  })

  it('should initialize with empty cart', () => {
    const { cart, total, itemCount, isEmpty } = useCart()
    
    expect(cart.value).toEqual([])
    expect(total.value).toBe(0)
    expect(itemCount.value).toBe(0)
    expect(isEmpty.value).toBe(true)
  })

  it('should add item to cart', async () => {
    const { addToCart, cart, total, itemCount } = useCart()
    
    const mockProduct = {
      id: '1',
      name: 'Sapato Teste',
      price: 100,
      images: ['test.jpg'],
      slug: 'sapato-teste'
    }

    const result = await addToCart(mockProduct, 1, '40')
    
    expect(result.success).toBe(true)
    expect(cart.value).toHaveLength(1)
    expect(cart.value[0].productId).toBe('1')
    expect(cart.value[0].quantity).toBe(1)
    expect(total.value).toBe(100)
    expect(itemCount.value).toBe(1)
  })

  it('should update quantity of existing item', async () => {
    const { addToCart, cart, itemCount } = useCart()
    
    const mockProduct = {
      id: '1',
      name: 'Sapato Teste',
      price: 100,
      images: ['test.jpg'],
      slug: 'sapato-teste'
    }

    // Add item twice with same size and color
    await addToCart(mockProduct, 1, '40', 'default')
    await addToCart(mockProduct, 1, '40', 'default')
    
    expect(cart.value).toHaveLength(1)
    expect(cart.value[0].quantity).toBe(2)
    expect(itemCount.value).toBe(2)
  })

  it('should remove item from cart', async () => {
    const { addToCart, removeFromCart, cart, isEmpty } = useCart()
    
    const mockProduct = {
      id: '1',
      name: 'Sapato Teste',
      price: 100,
      images: ['test.jpg'],
      slug: 'sapato-teste'
    }

    await addToCart(mockProduct, 1, '40', 'default')
    expect(cart.value).toHaveLength(1)
    
    removeFromCart('1', '40', 'default')
    expect(cart.value).toHaveLength(0)
    expect(isEmpty.value).toBe(true)
  })

  it('should calculate total correctly', async () => {
    const { addToCart, total } = useCart()
    
    const mockProduct1 = {
      id: '1',
      name: 'Sapato 1',
      price: 100,
      images: ['test1.jpg'],
      slug: 'sapato-1'
    }

    const mockProduct2 = {
      id: '2',
      name: 'Sapato 2',
      price: 200,
      images: ['test2.jpg'],
      slug: 'sapato-2'
    }

    await addToCart(mockProduct1, 2, '40')
    await addToCart(mockProduct2, 1, '38')
    
    expect(total.value).toBe(400) // (100 * 2) + (200 * 1)
  })

  it('should clear cart', async () => {
    const { addToCart, clearCart, cart, isEmpty } = useCart()
    
    const mockProduct = {
      id: '1',
      name: 'Sapato Teste',
      price: 100,
      images: ['test.jpg'],
      slug: 'sapato-teste'
    }

    await addToCart(mockProduct, 1, '40')
    expect(cart.value).toHaveLength(1)
    
    clearCart()
    expect(cart.value).toHaveLength(0)
    expect(isEmpty.value).toBe(true)
  })

  it('should save cart to localStorage', async () => {
    const { addToCart } = useCart()
    
    const mockProduct = {
      id: '1',
      name: 'Sapato Teste',
      price: 100,
      images: ['test.jpg'],
      slug: 'sapato-teste'
    }

    await addToCart(mockProduct, 1, '40')
    
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'cart',
      expect.stringContaining('"productId":"1"')
    )
  })
})
