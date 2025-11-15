<script setup lang="ts">
import { computed } from 'vue'
import BaseCard from '@/components/base/BaseCard.vue'
import { formatCurrency } from '@/utils/formatters'
import {
  ExclamationTriangleIcon,
  ShieldExclamationIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon
} from '@heroicons/vue/24/outline'

interface InsightData {
  totalFraudulentAmount: number
  potentialSavings: number
  detectionRate: number
  avgProcessingTime: number // in hours
  topFraudType: string
  fraudTrend: 'up' | 'down' | 'stable'
  fraudTrendPercentage: number
}

interface Props {
  data: InsightData
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const insights = computed(() => [
  {
    label: 'Fraudulent Amount Detected',
    value: formatCurrency(props.data.totalFraudulentAmount),
    icon: CurrencyDollarIcon,
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  },
  {
    label: 'Potential Savings',
    value: formatCurrency(props.data.potentialSavings),
    icon: ShieldExclamationIcon,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    label: 'Detection Rate',
    value: `${props.data.detectionRate.toFixed(1)}%`,
    icon: ExclamationTriangleIcon,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50'
  },
  {
    label: 'Avg Processing Time',
    value: `${props.data.avgProcessingTime.toFixed(1)}h`,
    icon: ArrowTrendingUpIcon,
    color: 'text-primary-600',
    bgColor: 'bg-primary-50'
  }
])

const getTrendIcon = computed(() => {
  if (props.data.fraudTrend === 'up') return '↑'
  if (props.data.fraudTrend === 'down') return '↓'
  return '→'
})

const getTrendColor = computed(() => {
  if (props.data.fraudTrend === 'up') return 'text-red-600'
  if (props.data.fraudTrend === 'down') return 'text-green-600'
  return 'text-gray-600'
})
</script>

<template>
  <BaseCard>
    <div class="p-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-gray-900">Fraud Detection Insights</h3>
        <ShieldExclamationIcon class="h-6 w-6 text-primary-600" />
      </div>

      <div v-if="loading" class="space-y-4">
        <div v-for="i in 4" :key="i" class="h-24 bg-gray-200 animate-pulse rounded-lg"></div>
      </div>

      <div v-else class="space-y-4">
        <!-- Key Metrics Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            v-for="insight in insights"
            :key="insight.label"
            :class="['p-4 rounded-lg border border-gray-200', insight.bgColor]"
          >
            <div class="flex items-start justify-between">
              <div>
                <p class="text-xs font-medium text-gray-600 mb-1">{{ insight.label }}</p>
                <p class="text-2xl font-bold text-gray-900">{{ insight.value }}</p>
              </div>
              <component
                :is="insight.icon"
                :class="['h-8 w-8', insight.color]"
              />
            </div>
          </div>
        </div>

        <!-- Fraud Trend Alert -->
        <div
          :class="[
            'p-4 rounded-lg border',
            data.fraudTrend === 'up' ? 'bg-red-50 border-red-200' :
            data.fraudTrend === 'down' ? 'bg-green-50 border-green-200' :
            'bg-gray-50 border-gray-200'
          ]"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-900">Fraud Trend (Last 30 Days)</p>
              <p class="text-xs text-gray-600 mt-1">
                Most common type: <span class="font-semibold">{{ data.topFraudType }}</span>
              </p>
            </div>
            <div class="text-right">
              <p :class="['text-2xl font-bold', getTrendColor]">
                {{ getTrendIcon }} {{ Math.abs(data.fraudTrendPercentage).toFixed(1) }}%
              </p>
              <p class="text-xs text-gray-600">
                {{ data.fraudTrend === 'up' ? 'Increase' : data.fraudTrend === 'down' ? 'Decrease' : 'Stable' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Additional Insights -->
        <div class="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <div class="flex items-start gap-3">
            <ExclamationTriangleIcon class="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
            <div>
              <p class="text-sm font-medium text-primary-900">Key Insight</p>
              <p class="text-xs text-primary-800 mt-1">
                Your fraud detection system has prevented
                <span class="font-semibold">{{ formatCurrency(data.potentialSavings) }}</span>
                in potential losses this month. Keep monitoring high-risk providers and members.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </BaseCard>
</template>
