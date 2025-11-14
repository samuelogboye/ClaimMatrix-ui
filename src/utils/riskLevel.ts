import type { RiskLevel } from '@/types'

/**
 * Get risk level from suspicion score
 */
export const getRiskLevel = (score: number): RiskLevel => {
  if (score >= 0.8) return 'high'
  if (score >= 0.6) return 'medium'
  if (score >= 0.4) return 'low'
  return 'none'
}

/**
 * Get risk level color classes
 */
export const getRiskColorClasses = (level: RiskLevel) => {
  const colors = {
    high: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
      badge: 'bg-red-100 text-red-800',
      dot: 'bg-red-500'
    },
    medium: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      badge: 'bg-amber-100 text-amber-800',
      dot: 'bg-amber-500'
    },
    low: {
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      border: 'border-orange-200',
      badge: 'bg-orange-100 text-orange-800',
      dot: 'bg-orange-500'
    },
    none: {
      bg: 'bg-gray-50',
      text: 'text-gray-700',
      border: 'border-gray-200',
      badge: 'bg-gray-100 text-gray-800',
      dot: 'bg-gray-500'
    }
  }
  return colors[level]
}

/**
 * Get risk level label
 */
export const getRiskLevelLabel = (level: RiskLevel): string => {
  const labels = {
    high: 'High Risk',
    medium: 'Medium Risk',
    low: 'Low Risk',
    none: 'No Risk'
  }
  return labels[level]
}

/**
 * Get risk badge variant from score
 */
export const getRiskBadgeVariant = (score: number) => {
  const level = getRiskLevel(score)
  const variants = {
    high: 'danger' as const,
    medium: 'warning' as const,
    low: 'warning' as const,
    none: 'neutral' as const
  }
  return variants[level]
}
