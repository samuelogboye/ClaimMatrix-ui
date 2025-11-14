import apiClient from './client'
import type {
  Claim,
  ClaimCreate,
  FlaggedClaim,
  PaginatedResponse,
  UploadResponse
} from '@/types/api'

export const claimsService = {
  /**
   * Get all claims (paginated)
   */
  async getAll(page = 1, pageSize = 20): Promise<PaginatedResponse<Claim>> {
    const response = await apiClient.get<PaginatedResponse<Claim>>('/claims/', {
      params: { page, page_size: pageSize }
    })
    return response.data
  },

  /**
   * Get single claim by ID
   */
  async getById(claimId: string): Promise<Claim> {
    const response = await apiClient.get<Claim>(`/claims/${claimId}`)
    return response.data
  },

  /**
   * Create a new claim
   */
  async create(claim: ClaimCreate): Promise<Claim> {
    const response = await apiClient.post<Claim>('/claims/', claim)
    return response.data
  },

  /**
   * Get claims by member ID
   */
  async getByMember(
    memberId: string,
    page = 1,
    pageSize = 20
  ): Promise<PaginatedResponse<Claim>> {
    const response = await apiClient.get<PaginatedResponse<Claim>>(
      `/claims/member/${memberId}`,
      {
        params: { page, page_size: pageSize }
      }
    )
    return response.data
  },

  /**
   * Get claims by provider ID
   */
  async getByProvider(
    providerId: string,
    page = 1,
    pageSize = 20
  ): Promise<PaginatedResponse<Claim>> {
    const response = await apiClient.get<PaginatedResponse<Claim>>(
      `/claims/provider/${providerId}`,
      {
        params: { page, page_size: pageSize }
      }
    )
    return response.data
  },

  /**
   * Get flagged claims
   */
  async getFlagged(
    minScore = 0.7,
    page = 1,
    pageSize = 20
  ): Promise<PaginatedResponse<FlaggedClaim>> {
    const response = await apiClient.get<PaginatedResponse<FlaggedClaim>>('/claims/flagged', {
      params: {
        min_suspicion_score: minScore,
        page,
        page_size: pageSize
      }
    })
    return response.data
  },

  /**
   * Upload CSV file
   */
  async uploadCSV(file: File): Promise<UploadResponse> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await apiClient.post<UploadResponse>('/claims/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }
}
