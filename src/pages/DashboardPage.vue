<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { claimsService } from '@/services/api/claims'
import { auditService } from '@/services/api/audit'
import { getRiskLevel } from '@/utils/riskLevel'
import type { Claim, AuditResult } from '@/types/api'
import BaseButton from '@/components/base/BaseButton.vue'
import AuditStatsCard from '@/components/audit/AuditStatsCard.vue'
import ClaimsTrendChart from '@/components/dashboard/ClaimsTrendChart.vue'
import TopProvidersCard from '@/components/dashboard/TopProvidersCard.vue'
import TopMembersCard from '@/components/dashboard/TopMembersCard.vue'
import FraudInsightsPanel from '@/components/dashboard/FraudInsightsPanel.vue'
import {
  DocumentTextIcon,
  FlagIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ArrowDownTrayIcon
} from '@heroicons/vue/24/outline'
import { useToast } from 'vue-toastification'

const router = useRouter()
const toast = useToast()

const loading = ref(false)
const claims = ref<Claim[]>([])
const auditResults = ref<AuditResult[]>([])

// Quick stats
const quickStats = computed(() => ({
  totalClaims: claims.value.length,
  flaggedClaims: auditResults.value.length,
  totalAmount: claims.value.reduce((sum, c) => sum + c.charge_amount, 0),
  avgClaimAmount: claims.value.length > 0
    ? claims.value.reduce((sum, c) => sum + c.charge_amount, 0) / claims.value.length
    : 0
}))

// Trend data (last 30 days)
const trendData = computed(() => {
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - i))
    return date.toISOString().split('T')[0]
  })

  return last30Days.map(date => {
    const dateClaims = claims.value.filter(c =>
      c.created_at.startsWith(date)
    )
    const dateAudits = auditResults.value.filter(a =>
      a.audit_timestamp.startsWith(date)
    )
    const highRisk = dateAudits.filter(a =>
      getRiskLevel(a.suspicion_score) === 'high'
    )

    return {
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      total: dateClaims.length,
      flagged: dateAudits.length,
      highRisk: highRisk.length
    }
  })
})

// Top providers analytics
const topProvidersData = computed(() => {
  const providerMap = new Map()

  claims.value.forEach(claim => {
    if (!providerMap.has(claim.provider_id)) {
      providerMap.set(claim.provider_id, {
        provider_id: claim.provider_id,
        total_claims: 0,
        total_amount: 0,
        flagged_count: 0,
        suspicion_scores: []
      })
    }

    const provider = providerMap.get(claim.provider_id)
    provider.total_claims++
    provider.total_amount += claim.charge_amount

    const audit = auditResults.value.find(a => a.claim_id === claim.claim_id)
    if (audit) {
      provider.flagged_count++
      provider.suspicion_scores.push(audit.suspicion_score)
    }
  })

  return Array.from(providerMap.values())
    .map(p => ({
      ...p,
      avg_suspicion_score: p.suspicion_scores.length > 0
        ? p.suspicion_scores.reduce((a: number, b: number) => a + b, 0) / p.suspicion_scores.length
        : 0
    }))
    .sort((a, b) => b.flagged_count - a.flagged_count)
})

// Top members analytics
const topMembersData = computed(() => {
  const memberMap = new Map()

  claims.value.forEach(claim => {
    if (!memberMap.has(claim.member_id)) {
      memberMap.set(claim.member_id, {
        member_id: claim.member_id,
        total_claims: 0,
        total_amount: 0,
        flagged_count: 0,
        suspicion_scores: []
      })
    }

    const member = memberMap.get(claim.member_id)
    member.total_claims++
    member.total_amount += claim.charge_amount

    const audit = auditResults.value.find(a => a.claim_id === claim.claim_id)
    if (audit) {
      member.flagged_count++
      member.suspicion_scores.push(audit.suspicion_score)
    }
  })

  return Array.from(memberMap.values())
    .map(m => ({
      ...m,
      avg_suspicion_score: m.suspicion_scores.length > 0
        ? m.suspicion_scores.reduce((a: number, b: number) => a + b, 0) / m.suspicion_scores.length
        : 0
    }))
    .sort((a, b) => b.flagged_count - a.flagged_count)
})

// Fraud insights
const fraudInsights = computed(() => {
  const highRiskAudits = auditResults.value.filter(a => getRiskLevel(a.suspicion_score) === 'high')
  const fraudulentAmount = highRiskAudits.reduce((sum, a) => {
    const claim = claims.value.find(c => c.claim_id === a.claim_id)
    return sum + (claim?.charge_amount || 0)
  }, 0)

  const detectionRate = claims.value.length > 0
    ? (auditResults.value.length / claims.value.length) * 100
    : 0

  // Calculate trend (simplified)
  const recentAudits = auditResults.value.slice(-7).length
  const previousAudits = auditResults.value.slice(-14, -7).length
  const fraudTrendPercentage = previousAudits > 0
    ? ((recentAudits - previousAudits) / previousAudits) * 100
    : 0

  return {
    totalFraudulentAmount: fraudulentAmount,
    potentialSavings: fraudulentAmount * 0.95, // Assuming 95% prevention rate
    detectionRate,
    avgProcessingTime: 2.5, // Mock value
    topFraudType: 'Duplicate Claims',
    fraudTrend: fraudTrendPercentage > 5 ? 'up' as const :
                 fraudTrendPercentage < -5 ? 'down' as const : 'stable' as const,
    fraudTrendPercentage
  }
})

// Fetch data
const fetchDashboardData = async () => {
  loading.value = true
  try {
    const [claimsResponse, auditsResponse] = await Promise.all([
      claimsService.getAll(1, 100),
      auditService.getAll(1, 100)
    ])

    claims.value = claimsResponse.items
    auditResults.value = auditsResponse.items
  } catch (error) {
    console.log("error", error)
    toast.error('Failed to load dashboard data')
  } finally {
    loading.value = false
  }
}

// Export report
const exportReport = () => {
  const headers = [
    'Metric',
    'Value'
  ]

  const rows = [
    ['Total Claims', quickStats.value.totalClaims],
    ['Flagged Claims', quickStats.value.flaggedClaims],
    ['Total Amount', quickStats.value.totalAmount],
    ['Average Claim Amount', quickStats.value.avgClaimAmount.toFixed(2)],
    ['Detection Rate', `${fraudInsights.value.detectionRate.toFixed(1)}%`],
    ['Fraudulent Amount', fraudInsights.value.totalFraudulentAmount],
    ['Potential Savings', fraudInsights.value.potentialSavings]
  ]

  const csv = [headers, ...rows].map(row => row.join(',')).join('\n')

  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `dashboard-report-${new Date().toISOString().split('T')[0]}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  toast.success('Report exported successfully')
}

// Initialize
onMounted(() => {
  fetchDashboardData()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <p class="mt-1 text-sm text-gray-500">
              Overview of claims and fraud detection analytics
            </p>
          </div>
          <div class="flex gap-3">
            <BaseButton variant="secondary" @click="exportReport">
              <ArrowDownTrayIcon class="w-4 h-4 mr-2" />
              Export Report
            </BaseButton>
            <BaseButton variant="primary" @click="fetchDashboardData">
              Refresh Data
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Quick Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <AuditStatsCard
          title="Total Claims"
          :value="quickStats.totalClaims"
          :icon="DocumentTextIcon"
          variant="primary"
          :loading="loading"
        />

        <AuditStatsCard
          title="Flagged Claims"
          :value="quickStats.flaggedClaims"
          :icon="FlagIcon"
          variant="warning"
          :loading="loading"
        />

        <AuditStatsCard
          title="Total Amount"
          :value="quickStats.totalAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })"
          :icon="CurrencyDollarIcon"
          variant="success"
          :loading="loading"
        />

        <AuditStatsCard
          title="Avg Claim Amount"
          :value="quickStats.avgClaimAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })"
          :icon="ChartBarIcon"
          variant="neutral"
          :loading="loading"
        />
      </div>

      <!-- Fraud Insights -->
      <div class="mb-8">
        <FraudInsightsPanel :data="fraudInsights" :loading="loading" />
      </div>

      <!-- Trend Chart -->
      <div class="mb-8">
        <ClaimsTrendChart :data="trendData" :loading="loading" />
      </div>

      <!-- Top Providers and Members -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <TopProvidersCard :data="topProvidersData" :loading="loading" />
        <TopMembersCard :data="topMembersData" :loading="loading" />
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <BaseButton
            variant="secondary"
            class="w-full"
            @click="$router.push('/claims')"
          >
            <DocumentTextIcon class="w-4 h-4 mr-2" />
            View All Claims
          </BaseButton>
          <BaseButton
            variant="secondary"
            class="w-full"
            @click="$router.push('/audit/flagged')"
          >
            <FlagIcon class="w-4 h-4 mr-2" />
            View Flagged Claims
          </BaseButton>
          <BaseButton
            variant="secondary"
            class="w-full"
            @click="$router.push('/claims/upload')"
          >
            <ArrowDownTrayIcon class="w-4 h-4 mr-2" />
            Upload Claims
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>
