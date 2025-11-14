import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Claim, FlaggedClaim, PaginationMeta } from '@/types/api'

export const useClaimsStore = defineStore('claims', () => {
  // State
  const list = ref<Claim[]>([])
  const currentClaim = ref<Claim | null>(null)
  const flaggedClaims = ref<FlaggedClaim[]>([])
  const pagination = ref<PaginationMeta | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Actions
  function setClaims(claims: Claim[]) {
    list.value = claims
  }

  function setCurrentClaim(claim: Claim | null) {
    currentClaim.value = claim
  }

  function setFlaggedClaims(claims: FlaggedClaim[]) {
    flaggedClaims.value = claims
  }

  function setPagination(meta: PaginationMeta) {
    pagination.value = meta
  }

  function setLoading(value: boolean) {
    loading.value = value
  }

  function setError(message: string | null) {
    error.value = message
  }

  return {
    // State
    list,
    currentClaim,
    flaggedClaims,
    pagination,
    loading,
    error,
    // Actions
    setClaims,
    setCurrentClaim,
    setFlaggedClaims,
    setPagination,
    setLoading,
    setError
  }
})
