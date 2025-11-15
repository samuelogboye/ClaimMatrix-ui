<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { auditService } from '@/services/api/audit'
import { claimsService } from '@/services/api/claims'
import { useDebounce } from '@/composables/useDebounce'
import type { AuditResult, Claim } from '@/types/api'
import { formatCurrency, formatDate, formatDateTime } from '@/utils/formatters'
import { getRiskLevel, getRiskColorClasses, getRiskLevelLabel } from '@/utils/riskLevel'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseBadge from '@/components/base/BaseBadge.vue'
import BasePagination from '@/components/base/BasePagination.vue'
import BaseSpinner from '@/components/base/BaseSpinner.vue'
import { MagnifyingGlassIcon, FunnelIcon, FlagIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import { useToast } from 'vue-toastification'

const router = useRouter()
const route = useRoute()
const toast = useToast()

// State
const searchQuery = ref('')
const selectedRiskFilter = ref<'all' | 'high' | 'medium' | 'low'>('all')
const sortBy = ref<'score' | 'date' | 'amount'>('score')
const sortDirection = ref<'asc' | 'desc'>('desc')
const page = ref(Number(route.query.page) || 1)
const pageSize = ref(Number(route.query.pageSize) || 20)
const loading = ref(false)

// Data
const auditResults = ref<AuditResult[]>([])
const claimsMap = ref<Record<string, Claim>>({})
const pagination = ref({
  page: 1,
  page_size: 20,
  total_items: 0,
  total_pages: 1
})

// Debounced search
const debouncedSearch = useDebounce(searchQuery, 500)

// Computed
const filteredResults = computed(() => {
  let results = auditResults.value

  // Filter by risk level
  if (selectedRiskFilter.value !== 'all') {
    results = results.filter(
      (result) => getRiskLevel(result.suspicion_score) === selectedRiskFilter.value
    )
  }

  // Search filter
  if (debouncedSearch.value) {
    const query = debouncedSearch.value.toLowerCase()
    results = results.filter((result) => {
      const claim = claimsMap.value[result.claim_id]
      return (
        result.claim_id.toLowerCase().includes(query) ||
        claim?.member_id.toLowerCase().includes(query) ||
        claim?.provider_id.toLowerCase().includes(query)
      )
    })
  }

  // Sort
  results = [...results].sort((a, b) => {
    let aVal: any, bVal: any

    switch (sortBy.value) {
      case 'score':
        aVal = a.suspicion_score
        bVal = b.suspicion_score
        break
      case 'date':
        aVal = new Date(a.audit_timestamp).getTime()
        bVal = new Date(b.audit_timestamp).getTime()
        break
      case 'amount':
        aVal = claimsMap.value[a.claim_id]?.charge_amount || 0
        bVal = claimsMap.value[b.claim_id]?.charge_amount || 0
        break
      default:
        return 0
    }

    if (sortDirection.value === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })

  return results
})

const paginatedResults = computed(() => {
  const start = (page.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredResults.value.slice(start, end)
})

const riskCounts = computed(() => {
  const counts = { high: 0, medium: 0, low: 0 }
  auditResults.value.forEach((result) => {
    const level = getRiskLevel(result.suspicion_score)
    counts[level]++
  })
  return counts
})

// Fetch flagged claims
const fetchFlaggedClaims = async () => {
  loading.value = true
  try {
    const response = await auditService.getFlagged(page.value, pageSize.value)
    auditResults.value = response.items

    // Fetch associated claims
    const claimIds = [...new Set(response.items.map((r) => r.claim_id))]
    const claimPromises = claimIds.map((id) => claimsService.getById(id))
    const claims = await Promise.all(claimPromises)

    claimsMap.value = claims.reduce((acc, claim) => {
      acc[claim.claim_id] = claim
      return acc
    }, {} as Record<string, Claim>)

    pagination.value = response.pagination
  } catch (error) {
    toast.error('Failed to load flagged claims')
  } finally {
    loading.value = false
  }
}

// View claim detail
const viewClaim = (claimId: string) => {
  router.push(`/claims/${claimId}`)
}

// Toggle sort
const toggleSort = (field: 'score' | 'date' | 'amount') => {
  if (sortBy.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = field
    sortDirection.value = 'desc'
  }
}

// Watchers
watch([page, pageSize], () => {
  router.push({
    query: {
      page: page.value,
      pageSize: pageSize.value
    }
  })
})

watch(debouncedSearch, () => {
  page.value = 1
})

watch(selectedRiskFilter, () => {
  page.value = 1
})

// Initialize
onMounted(() => {
  fetchFlaggedClaims()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-semibold text-gray-900">Flagged Claims</h1>
            <p class="mt-1 text-sm text-gray-500">
              {{ filteredResults.length.toLocaleString() }} claims flagged for review
            </p>
          </div>
          <BaseButton variant="primary" @click="$router.push('/audit/dashboard')">
            View Dashboard
          </BaseButton>
        </div>

        <!-- Risk Summary Cards -->
        <div class="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            class="bg-red-50 border border-red-200 rounded-lg p-4 cursor-pointer hover:bg-red-100 transition-colors"
            :class="{ 'ring-2 ring-red-500': selectedRiskFilter === 'high' }"
            @click="selectedRiskFilter = selectedRiskFilter === 'high' ? 'all' : 'high'"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-red-900">High Risk</p>
                <p class="mt-1 text-2xl font-bold text-red-900">{{ riskCounts.high }}</p>
              </div>
              <ExclamationTriangleIcon class="h-8 w-8 text-red-500" />
            </div>
          </div>

          <div
            class="bg-amber-50 border border-amber-200 rounded-lg p-4 cursor-pointer hover:bg-amber-100 transition-colors"
            :class="{ 'ring-2 ring-amber-500': selectedRiskFilter === 'medium' }"
            @click="selectedRiskFilter = selectedRiskFilter === 'medium' ? 'all' : 'medium'"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-amber-900">Medium Risk</p>
                <p class="mt-1 text-2xl font-bold text-amber-900">{{ riskCounts.medium }}</p>
              </div>
              <FlagIcon class="h-8 w-8 text-amber-500" />
            </div>
          </div>

          <div
            class="bg-blue-50 border border-blue-200 rounded-lg p-4 cursor-pointer hover:bg-blue-100 transition-colors"
            :class="{ 'ring-2 ring-blue-500': selectedRiskFilter === 'low' }"
            @click="selectedRiskFilter = selectedRiskFilter === 'low' ? 'all' : 'low'"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-blue-900">Low Risk</p>
                <p class="mt-1 text-2xl font-bold text-blue-900">{{ riskCounts.low }}</p>
              </div>
              <FlagIcon class="h-8 w-8 text-blue-500" />
            </div>
          </div>
        </div>

        <!-- Search and Sort -->
        <div class="mt-6 flex flex-col sm:flex-row gap-4">
          <div class="flex-1">
            <BaseInput
              v-model="searchQuery"
              type="search"
              placeholder="Search by claim ID, member ID, or provider ID..."
              :leading-icon="MagnifyingGlassIcon"
            />
          </div>
          <div class="flex gap-2">
            <BaseButton
              :variant="sortBy === 'score' ? 'primary' : 'secondary'"
              size="sm"
              @click="toggleSort('score')"
            >
              Risk Score
              <span v-if="sortBy === 'score'" class="ml-1">
                {{ sortDirection === 'asc' ? '↑' : '↓' }}
              </span>
            </BaseButton>
            <BaseButton
              :variant="sortBy === 'date' ? 'primary' : 'secondary'"
              size="sm"
              @click="toggleSort('date')"
            >
              Date
              <span v-if="sortBy === 'date'" class="ml-1">
                {{ sortDirection === 'asc' ? '↑' : '↓' }}
              </span>
            </BaseButton>
            <BaseButton
              :variant="sortBy === 'amount' ? 'primary' : 'secondary'"
              size="sm"
              @click="toggleSort('amount')"
            >
              Amount
              <span v-if="sortBy === 'amount'" class="ml-1">
                {{ sortDirection === 'asc' ? '↑' : '↓' }}
              </span>
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Claims List -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <BaseSpinner size="lg" />
      </div>

      <!-- Empty State -->
      <div
        v-else-if="filteredResults.length === 0"
        class="bg-white rounded-lg border border-gray-200 p-12 text-center"
      >
        <FlagIcon class="mx-auto h-12 w-12 text-gray-400" />
        <p class="mt-2 text-sm text-gray-500">No flagged claims found</p>
      </div>

      <!-- Claims Grid -->
      <div v-else class="space-y-4">
        <BaseCard
          v-for="result in paginatedResults"
          :key="result.id"
          class="hover:shadow-md transition-shadow cursor-pointer"
          @click="viewClaim(result.claim_id)"
        >
          <div class="p-6">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-3">
                  <h3 class="text-lg font-semibold text-gray-900 font-mono">
                    {{ result.claim_id }}
                  </h3>
                  <BaseBadge
                    :variant="
                      getRiskLevel(result.suspicion_score) === 'high'
                        ? 'danger'
                        : getRiskLevel(result.suspicion_score) === 'medium'
                          ? 'warning'
                          : 'info'
                    "
                    dot
                  >
                    {{ getRiskLevelLabel(getRiskLevel(result.suspicion_score)) }}
                  </BaseBadge>
                </div>

                <div class="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <p class="text-xs text-gray-500">Member ID</p>
                    <p class="text-sm font-medium text-gray-900 font-mono">
                      {{ claimsMap[result.claim_id]?.member_id }}
                    </p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Provider ID</p>
                    <p class="text-sm font-medium text-gray-900 font-mono">
                      {{ claimsMap[result.claim_id]?.provider_id }}
                    </p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Service Date</p>
                    <p class="text-sm font-medium text-gray-900">
                      {{ formatDate(claimsMap[result.claim_id]?.date_of_service) }}
                    </p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Charge Amount</p>
                    <p class="text-sm font-semibold text-gray-900">
                      {{ formatCurrency(claimsMap[result.claim_id]?.charge_amount || 0) }}
                    </p>
                  </div>
                </div>

                <!-- Risk Score Bar -->
                <div class="mt-4">
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-xs font-medium text-gray-700">Suspicion Score</span>
                    <span class="text-sm font-bold text-gray-900">
                      {{ (result.suspicion_score * 100).toFixed(1) }}%
                    </span>
                  </div>
                  <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      :class="[
                        'h-full transition-all duration-300',
                        getRiskColorClasses(getRiskLevel(result.suspicion_score)).dot
                      ]"
                      :style="{ width: `${result.suspicion_score * 100}%` }"
                    ></div>
                  </div>
                </div>

                <!-- Issues Count -->
                <div v-if="result.issue_count > 0" class="mt-3">
                  <p class="text-sm text-gray-600">
                    <span class="font-medium text-red-600">{{ result.issue_count }}</span>
                    {{ result.issue_count === 1 ? 'issue' : 'issues' }} detected
                  </p>
                </div>

                <!-- Audit Timestamp -->
                <div class="mt-2">
                  <p class="text-xs text-gray-500">
                    Audited {{ formatDateTime(result.audit_timestamp) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- Pagination -->
        <div v-if="filteredResults.length > pageSize" class="mt-6">
          <BasePagination
            :page="page"
            :page-size="pageSize"
            :total="filteredResults.length"
            :total-pages="Math.ceil(filteredResults.length / pageSize)"
            @update:page="page = $event"
            @update:page-size="pageSize = $event"
          />
        </div>
      </div>
    </div>
  </div>
</template>
