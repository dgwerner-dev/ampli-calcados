import { describe, it, expect } from 'vitest'

// Função helper para formatação de preço
const formatPrice = (price: number): string => {
  return price.toFixed(2).replace('.', ',')
}

// Função helper para formatação de moeda brasileira
const formatCurrency = (price: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price)
}

describe('formatPrice', () => {
  it('should format price correctly', () => {
    expect(formatPrice(100)).toBe('100,00')
    expect(formatPrice(99.9)).toBe('99,90')
    expect(formatPrice(1000.5)).toBe('1000,50')
  })

  it('should handle zero price', () => {
    expect(formatPrice(0)).toBe('0,00')
  })

  it('should handle decimal prices', () => {
    expect(formatPrice(99.99)).toBe('99,99')
    expect(formatPrice(199.95)).toBe('199,95')
  })

  it('should handle large numbers', () => {
    expect(formatPrice(999999.99)).toBe('999999,99')
  })
})

describe('formatCurrency', () => {
  it('should format currency correctly', () => {
    expect(formatCurrency(100)).toBe('R$\u00A0100,00')
    expect(formatCurrency(99.9)).toBe('R$\u00A099,90')
    expect(formatCurrency(1000.5)).toBe('R$\u00A01.000,50')
  })

  it('should handle zero currency', () => {
    expect(formatCurrency(0)).toBe('R$\u00A00,00')
  })

  it('should handle decimal currency', () => {
    expect(formatCurrency(99.99)).toBe('R$\u00A099,99')
    expect(formatCurrency(199.95)).toBe('R$\u00A0199,95')
  })

  it('should handle large currency values', () => {
    expect(formatCurrency(999999.99)).toBe('R$\u00A0999.999,99')
  })
})
