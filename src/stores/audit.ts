import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AuditResult, AuditStatistics } from '@/types/api'

export const useAuditStore = defineStore('audit', () => {
  // State
  const results = ref<AuditResult[]>([])
  const statistics = ref<AuditStatistics | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Actions
  function setResults(auditResults: AuditResult[]) {
    results.value = auditResults
  }

  function setStatistics(stats: AuditStatistics) {
    statistics.value = stats
  }

  function setLoading(value: boolean) {
    loading.value = value
  }

  function setError(message: string | null) {
    error.value = message
  }

  return {
    // State
    results,
    statistics,
    loading,
    error,
    // Actions
    setResults,
    setStatistics,
    setLoading,
    setError
  }
})
