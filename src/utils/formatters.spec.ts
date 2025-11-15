import { describe, it, expect } from 'vitest'
import { formatCurrency, formatDate, formatPercentage } from './formatters'

describe('formatters', () => {
  describe('formatCurrency', () => {
    it('should format positive numbers as currency', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56')
      expect(formatCurrency(0)).toBe('$0.00')
      expect(formatCurrency(1000000)).toBe('$1,000,000.00')
    })

    it('should format negative numbers as currency', () => {
      expect(formatCurrency(-1234.56)).toBe('-$1,234.56')
    })

    it('should handle decimal precision', () => {
      expect(formatCurrency(10.1)).toBe('$10.10')
      expect(formatCurrency(10.999)).toBe('$11.00')
    })
  })

  describe('formatDate', () => {
    it('should format ISO date strings', () => {
      const date = '2024-01-15'
      const formatted = formatDate(date)
      expect(formatted).toBe('Jan 15, 2024')
    })

    it('should format datetime strings', () => {
      const datetime = '2024-01-15T10:30:00Z'
      const formatted = formatDate(datetime)
      expect(formatted).toBe('Jan 15, 2024')
    })

    it('should handle invalid dates', () => {
      expect(formatDate('invalid')).toBe('invalid')
      expect(formatDate('')).toBe('')
    })

    it('should format with custom format', () => {
      const date = '2024-01-15'
      const formatted = formatDate(date, 'yyyy-MM-dd')
      expect(formatted).toBe('2024-01-15')
    })
  })

  describe('formatPercentage', () => {
    it('should format decimal as percentage', () => {
      expect(formatPercentage(0.75)).toBe('75.0%')
      expect(formatPercentage(0.5)).toBe('50.0%')
      expect(formatPercentage(1)).toBe('100.0%')
    })

    it('should handle zero', () => {
      expect(formatPercentage(0)).toBe('0.0%')
    })

    it('should handle values greater than 1', () => {
      expect(formatPercentage(1.5)).toBe('150.0%')
    })

    it('should respect decimal places', () => {
      expect(formatPercentage(0.12345, 2)).toBe('12.35%')
      expect(formatPercentage(0.12345, 0)).toBe('12%')
    })
  })
})
