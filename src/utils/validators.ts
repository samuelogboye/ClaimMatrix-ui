/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate password strength
 * Minimum 8 characters, at least one letter and one number
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 8
}

/**
 * Get password strength
 */
export const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
  if (password.length < 8) return 'weak'

  let strength = 0
  if (password.length >= 12) strength++
  if (/[a-z]/.test(password)) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^a-zA-Z0-9]/.test(password)) strength++

  if (strength >= 4) return 'strong'
  if (strength >= 2) return 'medium'
  return 'weak'
}

/**
 * Validate file type
 */
export const isValidFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type)
}

/**
 * Validate file size
 */
export const isValidFileSize = (file: File, maxSizeInBytes: number): boolean => {
  return file.size <= maxSizeInBytes
}

/**
 * Validate date format (YYYY-MM-DD)
 */
export const isValidDate = (dateString: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(dateString)) return false

  const date = new Date(dateString)
  return !isNaN(date.getTime())
}

/**
 * Validate claim ID format
 */
export const isValidClaimId = (claimId: string): boolean => {
  return claimId.length > 0 && claimId.length <= 255
}

/**
 * Validate CPT code format
 */
export const isValidCPTCode = (code: string): boolean => {
  return code.length > 0 && code.length <= 50
}

/**
 * Validate charge amount
 */
export const isValidChargeAmount = (amount: number): boolean => {
  return amount > 0
}
