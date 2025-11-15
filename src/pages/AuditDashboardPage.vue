<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auditService } from '@/services/api/audit'
import { getRiskLevel } from '@/utils/riskLevel'
import type { AuditResult } from '@/types/api'
import AuditStatsCard from '@/components/audit/AuditStatsCard.vue'
import RiskDistributionChart from '@/components/audit/RiskDistributionChart.vue'
import AuditTriggerPanel from '@/components/audit/AuditTriggerPanel.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import {
  FlagIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  ChartBarIcon
} from '@heroicons/vue/24/outline'
import { useToast } from 'vue-toastification'

const router = useRouter()
const toast = useToast()

const loading = ref(false)
const auditResults = ref<AuditResult[]>([])
const stats = ref({
  totalAudits: 0,
  highRisk: 0,
  mediumRisk: 0,
  lowRisk: 0,
  avgSuspicionScore: 0,
  totalIssues: 0
})

const riskDistribution = computed(() => ({
  high: stats.value.highRisk,
  medium: stats.value.mediumRisk,
  low: stats.value.lowRisk
}))

const recentAudits = computed(() => {
  return auditResults.value.slice(0, 5)
})

// Fetch audit statistics
const fetchAuditStats = async () => {
  loading.value = true
  try {
    const response = await auditService.getFlagged(0, 1, 100)
    auditResults.value = response.items

    // Calculate statistics
    let highCount = 0
    let mediumCount = 0
    let lowCount = 0
    let totalScore = 0
    let totalIssues = 0

    response.items.forEach((result) => {
      const riskLevel = getRiskLevel(result.suspicion_score)
      if (riskLevel === 'high') highCount++
      else if (riskLevel === 'medium') mediumCount++
      else lowCount++

      totalScore += result.suspicion_score
      totalIssues += result.issue_count
    })

    stats.value = {
      totalAudits: response.items.length,
      highRisk: highCount,
      mediumRisk: mediumCount,
      lowRisk: lowCount,
      avgSuspicionScore: response.items.length > 0 ? totalScore / response.items.length : 0,
      totalIssues
    }
  } catch (error) {
  console.log("error", error)
    toast.error('Failed to load audit statistics')
  } finally {
    loading.value = false
  }
}

// Initialize
onMounted(() => {
  fetchAuditStats()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-semibold text-gray-900">Audit Dashboard</h1>
            <p class="mt-1 text-sm text-gray-500">
              Monitor and manage fraud detection audits
            </p>
          </div>
          <div class="flex gap-3">
            <BaseButton variant="secondary" @click="$router.push('/audit/flagged')">
              <FlagIcon class="w-4 h-4 mr-2" />
              View Flagged Claims
            </BaseButton>
            <BaseButton variant="primary" @click="fetchAuditStats">
              Refresh Data
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Stats Overview -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <AuditStatsCard
          title="Total Audits"
          :value="stats.totalAudits"
          :icon="ChartBarIcon"
          variant="primary"
          :loading="loading"
        />

        <AuditStatsCard
          title="High Risk"
          :value="stats.highRisk"
          :icon="ExclamationTriangleIcon"
          variant="danger"
          :loading="loading"
        />

        <AuditStatsCard
          title="Medium Risk"
          :value="stats.mediumRisk"
          :icon="FlagIcon"
          variant="warning"
          :loading="loading"
        />

        <AuditStatsCard
          title="Low Risk"
          :value="stats.lowRisk"
          :icon="ShieldCheckIcon"
          variant="success"
          :loading="loading"
        />
      </div>

      <!-- Additional Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <AuditStatsCard
          title="Average Suspicion Score"
          :value="`${(stats.avgSuspicionScore * 100).toFixed(1)}%`"
          variant="neutral"
          :loading="loading"
        />

        <AuditStatsCard
          title="Total Issues Detected"
          :value="stats.totalIssues"
          variant="neutral"
          :loading="loading"
        />
      </div>

      <!-- Charts and Trigger Panel -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div class="lg:col-span-2">
          <RiskDistributionChart
            :data="riskDistribution"
            :loading="loading"
          />
        </div>

        <div>
          <AuditTriggerPanel />
        </div>
      </div>

      <!-- Recent Audits -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">Recent Audits</h2>
            <BaseButton
              variant="ghost"
              size="sm"
              @click="$router.push('/audit/flagged')"
            >
              View All
            </BaseButton>
          </div>
        </div>

        <div v-if="loading" class="px-6 py-12 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
        </div>

        <div v-else-if="recentAudits.length === 0" class="px-6 py-12 text-center">
          <FlagIcon class="mx-auto h-12 w-12 text-gray-400" />
          <p class="mt-2 text-sm text-gray-500">No audits found</p>
        </div>

        <div v-else class="divide-y divide-gray-200">
          <div
            v-for="audit in recentAudits"
            :key="audit.id"
            class="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
            @click="$router.push(`/claims/${audit.claim_id}`)"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-3">
                  <p class="text-sm font-mono font-medium text-gray-900">
                    {{ audit.claim_id }}
                  </p>
                  <span
                    :class="[
                      'px-2 py-1 rounded-full text-xs font-medium',
                      getRiskLevel(audit.suspicion_score) === 'high'
                        ? 'bg-red-100 text-red-800'
                        : getRiskLevel(audit.suspicion_score) === 'medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                    ]"
                  >
                    {{ getRiskLevel(audit.suspicion_score).toUpperCase() }}
                  </span>
                </div>

                <div class="mt-2 flex items-center gap-4 text-sm text-gray-600">
                  <span>
                    Score: <span class="font-medium text-gray-900">{{ (audit.suspicion_score * 100).toFixed(1) }}%</span>
                  </span>
                  <span>
                    Issues: <span class="font-medium text-gray-900">{{ audit.issue_count }}</span>
                  </span>
                  <span class="text-xs">
                    {{ new Date(audit.audit_timestamp).toLocaleDateString() }}
                  </span>
                </div>
              </div>

              <div class="ml-4">
                <svg
                  class="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
