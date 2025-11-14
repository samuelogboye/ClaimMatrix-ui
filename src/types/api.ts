// Authentication
export interface UserRegister {
  name: string
  email: string
  password: string
}

export interface UserLogin {
  email: string
  password: string
}

export interface Token {
  access_token: string
  token_type: string
}

// User
export interface User {
  id: string
  name: string
  email: string
  created_at: string
  updated_at: string
}

// Claim
export interface Claim {
  id: string
  claim_id: string
  member_id: string
  provider_id: string
  date_of_service: string
  cpt_code: string
  charge_amount: number
  created_at: string
}

export interface ClaimCreate {
  claim_id: string
  member_id: string
  provider_id: string
  date_of_service: string
  cpt_code: string
  charge_amount: number
}

// Audit Result
export interface AuditResult {
  id: string
  claim_id: string
  issues: string[]
  issue_count: number
  suspicion_score: number
  recommended_action: string
  audit_timestamp: string
}

export interface FlaggedClaim {
  claim_id: string
  member_id: string
  provider_id: string
  date_of_service: string
  cpt_code: string
  charge_amount: number
  issues: string[]
  suspicion_score: number
  recommended_action: string
  audit_timestamp: string
}

// Pagination
export interface PaginationMeta {
  page: number
  page_size: number
  total_items: number
  total_pages: number
  has_next: boolean
  has_previous: boolean
}

export interface PaginatedResponse<T> {
  items: T[]
  pagination: PaginationMeta
}

// Statistics
export interface AuditStatistics {
  total_claims: number
  total_audited: number
  audit_coverage: number
  flagged_counts: {
    high_risk: number
    medium_risk: number
    low_risk: number
    total_flagged: number
  }
}

// File Upload
export interface UploadResponse {
  status: string
  message: string
  task_id: string
  filename: string
}

// ML Audit
export interface MLAuditResponse {
  status: string
  message: string
  task_id: string
  description: string
}

// Error
export interface ErrorResponse {
  detail: string | ValidationError[]
}

export interface ValidationError {
  loc: (string | number)[]
  msg: string
  type: string
}
