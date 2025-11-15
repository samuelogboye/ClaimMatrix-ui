import { describe, it, expect } from 'vitest'
import { getRiskLevel, getRiskColorClasses, getRiskLevelLabel } from './riskLevel'

describe('riskLevel', () => {
  describe('getRiskLevel', () => {
    it('should return "high" for scores >= 0.8', () => {
      expect(getRiskLevel(0.8)).toBe('high')
      expect(getRiskLevel(0.9)).toBe('high')
      expect(getRiskLevel(1.0)).toBe('high')
    })

    it('should return "medium" for scores >= 0.6 and < 0.8', () => {
      expect(getRiskLevel(0.6)).toBe('medium')
      expect(getRiskLevel(0.7)).toBe('medium')
      expect(getRiskLevel(0.79)).toBe('medium')
    })

    it('should return "low" for scores >= 0.4 and < 0.6', () => {
      expect(getRiskLevel(0.4)).toBe('low')
      expect(getRiskLevel(0.5)).toBe('low')
      expect(getRiskLevel(0.59)).toBe('low')
    })

    it('should return "none" for scores < 0.4', () => {
      expect(getRiskLevel(0.0)).toBe('none')
      expect(getRiskLevel(0.2)).toBe('none')
      expect(getRiskLevel(0.39)).toBe('none')
    })
  })

  describe('getRiskColorClasses', () => {
    it('should return red for high risk', () => {
      const color = getRiskColorClasses('high')
      expect(color.text).toContain('red')
      expect(color.bg).toContain('red')
    })

    it('should return amber for medium risk', () => {
      const color = getRiskColorClasses('medium')
      expect(color.text).toContain('amber')
      expect(color.bg).toContain('amber')
    })

    it('should return orange for low risk', () => {
      const color = getRiskColorClasses('low')
      expect(color.text).toContain('orange')
      expect(color.bg).toContain('orange')
    })

    it('should return gray for no risk', () => {
      const color = getRiskColorClasses('none')
      expect(color.text).toContain('gray')
      expect(color.bg).toContain('gray')
    })
  })

  describe('getRiskLevelLabel', () => {
    it('should return correct labels for risk levels', () => {
      expect(getRiskLevelLabel('high')).toBe('High Risk')
      expect(getRiskLevelLabel('medium')).toBe('Medium Risk')
      expect(getRiskLevelLabel('low')).toBe('Low Risk')
      expect(getRiskLevelLabel('none')).toBe('No Risk')
    })
  })
})
