<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { claimsService } from '@/services/api/claims'
import { auditService } from '@/services/api/audit'
import type { Claim, AuditResult } from '@/types/api'
import { formatCurrency, formatDate, formatDateTime } from '@/utils/formatters'
import { getRiskLevel, getRiskColorClasses, getRiskLevelLabel } from '@/utils/riskLevel'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseBadge from '@/components/base/BaseBadge.vue'
import BaseSpinner from '@/components/base/BaseSpinner.vue'
import { ChevronLeftIcon, FlagIcon } from '@heroicons/vue/24/outline'
import { useToast } from 'vue-toastification'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const claim = ref<Claim | null>(null)
const auditResults = ref<AuditResult[]>([])
const loading = ref(false)
const auditLoading = ref(false)

const claimId = route.params.claimId as string

// Fetch claim details
const fetchClaim = async () => {
  loading.value = true
  try {
    claim.value = await claimsService.getById(claimId)
  } catch (error) {
    toast.error('Failed to load claim details')
    router.push('/claims')
  } finally {
    loading.value = false
  }
}

// Fetch audit results
const fetchAuditResults = async () => {
  auditLoading.value = true
  try {
    auditResults.value = await auditService.getResultsByClaim(claimId)
  } catch (error) {
    // Audit results might not exist, don't show error
    auditResults.value = []
  } finally {
    auditLoading.value = false
  }
}

onMounted(() => {
  fetchClaim()
  fetchAuditResults()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center gap-4">
          <BaseButton variant="ghost" @click="$router.push('/claims')">
            <ChevronLeftIcon class="h-5 w-5" />
          </BaseButton>
          <div>
            <h1 class="text-2xl font-semibold text-gray-900">Claim Details</h1>
            <p v-if="claim" class="mt-1 text-sm text-gray-500 font-mono">{{ claim.claim_id }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <BaseSpinner size="lg" />
      </div>

      <!-- Claim Information -->
      <div v-else-if="claim" class="space-y-6">
        <!-- Basic Information Card -->
        <BaseCard>
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900">Claim Information</h2>
          </div>
          <div class="px-6 py-6">
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <dt class="text-sm font-medium text-gray-500">Claim ID</dt>
                <dd class="mt-1 text-sm font-mono text-gray-900">{{ claim.claim_id }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Service Date</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ formatDate(claim.date_of_service) }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Member ID</dt>
                <dd class="mt-1 text-sm font-mono text-gray-900">{{ claim.member_id }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Provider ID</dt>
                <dd class="mt-1 text-sm font-mono text-gray-900">{{ claim.provider_id }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">CPT Code</dt>
                <dd class="mt-1">
                  <BaseBadge variant="neutral">{{ claim.cpt_code }}</BaseBadge>
                </dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Charge Amount</dt>
                <dd class="mt-1 text-lg font-semibold text-gray-900">
                  {{ formatCurrency(claim.charge_amount) }}
                </dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Created At</dt>
                <dd class="mt-1 text-sm text-gray-900">
                  {{ formatDateTime(claim.created_at) }}
                </dd>
              </div>
            </dl>
          </div>
        </BaseCard>

        <!-- Audit Results Card -->
        <BaseCard>
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold text-gray-900">Audit Results</h2>
              <BaseBadge v-if="auditResults.length > 0" variant="warning" dot>
                {{ auditResults.length }} {{ auditResults.length === 1 ? 'Result' : 'Results' }}
              </BaseBadge>
            </div>
          </div>

          <div v-if="auditLoading" class="px-6 py-12 text-center">
            <BaseSpinner size="md" class="mx-auto" />
          </div>

          <div v-else-if="auditResults.length === 0" class="px-6 py-12 text-center">
            <FlagIcon class="mx-auto h-12 w-12 text-gray-400" />
            <p class="mt-2 text-sm text-gray-500">No audit results available for this claim</p>
          </div>

          <div v-else class="divide-y divide-gray-200">
            <div
              v-for="result in auditResults"
              :key="result.id"
              class="px-6 py-6"
            >
              <!-- Risk Score -->
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h3 class="text-sm font-medium text-gray-900">Suspicion Score</h3>
                  <p class="text-xs text-gray-500">
                    {{ formatDateTime(result.audit_timestamp) }}
                  </p>
                </div>
                <div class="text-right">
                  <div class="text-2xl font-bold text-gray-900">
                    {{ (result.suspicion_score * 100).toFixed(1) }}%
                  </div>
                  <BaseBadge
                    :variant="
                      getRiskLevel(result.suspicion_score) === 'high'
                        ? 'danger'
                        : getRiskLevel(result.suspicion_score) === 'medium'
                          ? 'warning'
                          : 'info'
                    "
                  >
                    {{ getRiskLevelLabel(getRiskLevel(result.suspicion_score)) }}
                  </BaseBadge>
                </div>
              </div>

              <!-- Progress Bar -->
              <div class="mb-4">
                <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    :class="[
                      'h-full transition-all duration-300',
                      getRiskColorClasses(getRiskLevel(result.suspicion_score)).dot.replace('bg-', 'bg-')
                    ]"
                    :style="{ width: `${result.suspicion_score * 100}%` }"
                  ></div>
                </div>
              </div>

              <!-- Issues -->
              <div v-if="result.issues.length > 0" class="mb-4">
                <h4 class="text-sm font-medium text-gray-900 mb-2">
                  Issues Found ({{ result.issue_count }})
                </h4>
                <ul class="space-y-2">
                  <li
                    v-for="(issue, idx) in result.issues"
                    :key="idx"
                    class="flex items-start gap-2 text-sm text-gray-700"
                  >
                    <span class="flex-shrink-0 h-1.5 w-1.5 rounded-full bg-red-500 mt-2"></span>
                    <span>{{ issue }}</span>
                  </li>
                </ul>
              </div>

              <!-- Recommended Action -->
              <div class="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 class="text-sm font-medium text-amber-900 mb-1">Recommended Action</h4>
                <p class="text-sm text-amber-800">{{ result.recommended_action }}</p>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>

