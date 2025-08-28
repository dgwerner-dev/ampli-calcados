import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useFreeShippingInfo } from '@/composables/useFreeShippingInfo'

// Mock $fetch
const mockFetch = vi.fn()
global.$fetch = mockFetch

describe('useFreeShippingInfo', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with default values', () => {
    const { freeShippingInfo, message } = useFreeShippingInfo()
    
    expect(freeShippingInfo.value).toEqual({
      hasPromotion: false,
      minOrderValue: 0,
      promotionName: '',
      message: ''
    })
    expect(message.value).toBe('')
  })

  it('should load free shipping info successfully', async () => {
    const { loadFreeShippingInfo, freeShippingInfo, message } = useFreeShippingInfo()
    
    const mockPromotion = {
      id: '1',
      name: 'Frete grátis para compras acima de R$ 599,00',
      minOrderValue: 599,
      discountType: 'FREE_SHIPPING',
      isActive: true
    }

    mockFetch.mockResolvedValue(mockPromotion)

    await loadFreeShippingInfo()
    
    expect(freeShippingInfo.value).toEqual({
      hasPromotion: true,
      minOrderValue: 599,
      promotionName: 'Frete grátis para compras acima de R$ 599,00',
      message: 'Frete grátis para compras acima de R$ 599,00'
    })
    expect(message.value).toBe('Frete grátis para compras acima de R$ 599,00')
    expect(mockFetch).toHaveBeenCalledWith('/api/shipping-promotions/minimum-free-shipping')
  })

  it('should handle no promotion found', async () => {
    const { loadFreeShippingInfo, freeShippingInfo, message } = useFreeShippingInfo()
    
    mockFetch.mockResolvedValue(null)

    await loadFreeShippingInfo()
    
    expect(freeShippingInfo.value).toEqual({
      hasPromotion: false,
      minOrderValue: 0,
      promotionName: '',
      message: 'Frete grátis em promoções especiais'
    })
    expect(message.value).toBe('Frete grátis em promoções especiais')
  })

  it('should handle API error gracefully', async () => {
    const { loadFreeShippingInfo, freeShippingInfo, message } = useFreeShippingInfo()
    
    const error = new Error('API Error')
    mockFetch.mockRejectedValue(error)

    await loadFreeShippingInfo()
    
    expect(freeShippingInfo.value).toEqual({
      hasPromotion: false,
      minOrderValue: 0,
      promotionName: '',
      message: 'Frete grátis em promoções especiais'
    })
    expect(message.value).toBe('Frete grátis em promoções especiais')
  })

  it('should return early during SSR', async () => {
    const { loadFreeShippingInfo, freeShippingInfo } = useFreeShippingInfo()
    
    // Mock process.server
    const originalProcess = global.process
    global.process = { ...originalProcess, server: true }

    await loadFreeShippingInfo()
    
    expect(freeShippingInfo.value).toEqual({
      hasPromotion: false,
      minOrderValue: 0,
      promotionName: '',
      message: ''
    })
    expect(mockFetch).not.toHaveBeenCalled()

    // Restore process
    global.process = originalProcess
  })

  it('should update message when promotion changes', async () => {
    const { loadFreeShippingInfo, freeShippingInfo, message } = useFreeShippingInfo()
    
    const mockPromotion = {
      id: '1',
      name: 'Promoção especial: Frete grátis acima de R$ 299,00',
      minOrderValue: 299,
      discountType: 'FREE_SHIPPING',
      isActive: true
    }

    mockFetch.mockResolvedValue(mockPromotion)

    await loadFreeShippingInfo()
    
    expect(freeShippingInfo.value.message).toBe('Promoção especial: Frete grátis acima de R$ 299,00')
    expect(message.value).toBe('Promoção especial: Frete grátis acima de R$ 299,00')
  })
})
