import type { AxiosError } from 'axios'
import type { ErrorResponse, ValidationError } from '@/types/api'

/**
 * Parse validation errors from API
 */
export const parseValidationErrors = (errors: ValidationError[]): string => {
  return errors.map((error) => error.msg).join(', ')
}

/**
 * Handle API errors and return user-friendly messages
 */
export const handleApiError = (error: AxiosError<ErrorResponse>): string => {
  // Network error
  if (!error.response) {
    return 'Network error. Please check your connection and try again.'
  }

  const { status, data } = error.response

  // Handle different status codes
  switch (status) {
    case 400:
      return typeof data.detail === 'string' ? data.detail : 'Invalid request data.'

    case 401:
      return 'Session expired. Please login again.'

    case 403:
      return 'You do not have permission to perform this action.'

    case 404:
      return typeof data.detail === 'string' ? data.detail : 'Resource not found.'

    case 413:
      return 'File size exceeds maximum allowed size.'

    case 422:
      // Validation errors
      if (Array.isArray(data.detail)) {
        return parseValidationErrors(data.detail)
      }
      return typeof data.detail === 'string' ? data.detail : 'Validation error.'

    case 429:
      return 'Too many requests. Please try again later.'

    case 500:
    case 502:
    case 503:
    case 504:
      return 'Server error. Please try again later.'

    default:
      return typeof data.detail === 'string'
        ? data.detail
        : 'An unexpected error occurred. Please try again.'
  }
}

/**
 * Log errors in development
 */
export const logError = (error: AxiosError, context?: string) => {
  if (import.meta.env.DEV) {
    console.error(`[API Error${context ? ` - ${context}` : ''}]:`, {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    })
  }
}
