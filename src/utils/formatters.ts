import { format, parseISO } from 'date-fns'

/**
 * Format currency amount
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

/**
 * Format date from ISO string
 */
export const formatDate = (dateString: string, formatString = 'MMM dd, yyyy'): string => {
  try {
    const date = parseISO(dateString)
    return format(date, formatString)
  } catch (error) {
    return dateString
  }
}

/**
 * Format date and time from ISO string
 */
export const formatDateTime = (
  dateString: string,
  formatString = 'MMM dd, yyyy HH:mm'
): string => {
  try {
    const date = parseISO(dateString)
    return format(date, formatString)
  } catch (error) {
    return dateString
  }
}

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

/**
 * Format percentage
 */
export const formatPercentage = (value: number, decimals = 1): string => {
  return `${(value * 100).toFixed(decimals)}%`
}

/**
 * Format number with commas
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value)
}

/**
 * Truncate text
 */
export const truncate = (text: string, length: number): string => {
  if (text.length <= length) return text
  return `${text.substring(0, length)}...`
}
