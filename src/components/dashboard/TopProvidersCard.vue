<script setup lang="ts">
import { computed } from 'vue'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseBadge from '@/components/base/BaseBadge.vue'
import { formatCurrency } from '@/utils/formatters'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

interface ProviderData {
  provider_id: string
  flagged_count: number
  total_claims: number
  total_amount: number
  avg_suspicion_score: number
}

interface Props {
  data: ProviderData[]
  title?: string
  loading?: boolean
  limit?: number
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Top Flagged Providers',
  loading: false,
  limit: 5
})

const topProviders = computed(() => {
  return props.data.slice(0, props.limit)
})

const getFlagRate = (provider: ProviderData) => {
  if (provider.total_claims === 0) return 0
  return (provider.flagged_count / provider.total_claims) * 100
}

const getRiskColor = (score: number) => {
  if (score >= 0.7) return 'danger'
  if (score >= 0.4) return 'warning'
  return 'info'
}
</script>

<template>
  <BaseCard>
    <div class="p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
        <ExclamationTriangleIcon class="h-5 w-5 text-amber-500" />
      </div>

      <div v-if="loading" class="space-y-3">
        <div v-for="i in limit" :key="i" class="h-20 bg-gray-200 animate-pulse rounded-lg"></div>
      </div>

      <div
        v-else-if="topProviders.length === 0"
        class="flex items-center justify-center py-12 text-gray-500"
      >
        <p class="text-sm">No provider data available</p>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="(provider, index) in topProviders"
          :key="provider.provider_id"
          class="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <span class="text-sm font-bold text-gray-400">#{{ index + 1 }}</span>
                <span class="text-sm font-mono font-semibold text-gray-900">
                  {{ provider.provider_id }}
                </span>
                <BaseBadge
                  :variant="getRiskColor(provider.avg_suspicion_score)"
                  size="sm"
                >
                  {{ (provider.avg_suspicion_score * 100).toFixed(0) }}%
                </BaseBadge>
              </div>

              <div class="mt-2 grid grid-cols-3 gap-3 text-xs">
                <div>
                  <p class="text-gray-500">Flagged</p>
                  <p class="font-semibold text-gray-900">
                    {{ provider.flagged_count }} / {{ provider.total_claims }}
                  </p>
                </div>
                <div>
                  <p class="text-gray-500">Flag Rate</p>
                  <p class="font-semibold text-gray-900">
                    {{ getFlagRate(provider).toFixed(1) }}%
                  </p>
                </div>
                <div>
                  <p class="text-gray-500">Total Amount</p>
                  <p class="font-semibold text-gray-900">
                    {{ formatCurrency(provider.total_amount) }}
                  </p>
                </div>
              </div>

              <!-- Progress bar for flag rate -->
              <div class="mt-3">
                <div class="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    :class="[
                      'h-full transition-all duration-300',
                      getFlagRate(provider) >= 50 ? 'bg-red-500' :
                      getFlagRate(provider) >= 25 ? 'bg-amber-500' : 'bg-blue-500'
                    ]"
                    :style="{ width: `${getFlagRate(provider)}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </BaseCard>
</template>
