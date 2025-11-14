import apiClient from './client'
import type {
  AuditResult,
  AuditStatistics,
  FlaggedClaim,
  MLAuditResponse,
  PaginatedResponse
} from '@/types/api'

export const auditService = {
  /**
   * Get audit results for a specific claim
   */
  async getResultsByClaim(claimId: string): Promise<AuditResult[]> {
    const response = await apiClient.get<AuditResult[]>(`/audit-results/claim/${claimId}`)
    return response.data
  },

  /**
   * Get flagged audit results
   */
  async getFlagged(
    minScore = 0.7,
    page = 1,
    pageSize = 20
  ): Promise<PaginatedResponse<FlaggedClaim>> {
    const response = await apiClient.get<PaginatedResponse<FlaggedClaim>>(
      '/audit-results/flagged',
      {
        params: {
          min_suspicion_score: minScore,
          page,
          page_size: pageSize
        }
      }
    )
    return response.data
  },

  /**
   * Get audit statistics
   */
  async getStatistics(): Promise<AuditStatistics> {
    const response = await apiClient.get<AuditStatistics>('/audit-results/stats')
    return response.data
  },

  /**
   * Trigger ML audit
   */
  async triggerMLAudit(): Promise<MLAuditResponse> {
    const response = await apiClient.post<MLAuditResponse>('/audit-results/ml-audit/trigger')
    return response.data
  }
}
