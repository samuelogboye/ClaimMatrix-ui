<script setup lang="ts">
import { computed } from 'vue'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseBadge from '@/components/base/BaseBadge.vue'
import { formatCurrency } from '@/utils/formatters'
import { UserIcon } from '@heroicons/vue/24/outline'

interface MemberData {
  member_id: string
  flagged_count: number
  total_claims: number
  total_amount: number
  avg_suspicion_score: number
}

interface Props {
  data: MemberData[]
  title?: string
  loading?: boolean
  limit?: number
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Top Flagged Members',
  loading: false,
  limit: 5
})

const topMembers = computed(() => {
  return props.data.slice(0, props.limit)
})

const getFlagRate = (member: MemberData) => {
  if (member.total_claims === 0) return 0
  return (member.flagged_count / member.total_claims) * 100
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
        <UserIcon class="h-5 w-5 text-primary-500" />
      </div>

      <div v-if="loading" class="space-y-3">
        <div v-for="i in limit" :key="i" class="h-20 bg-gray-200 animate-pulse rounded-lg"></div>
      </div>

      <div
        v-else-if="topMembers.length === 0"
        class="flex items-center justify-center py-12 text-gray-500"
      >
        <p class="text-sm">No member data available</p>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="(member, index) in topMembers"
          :key="member.member_id"
          class="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <span class="text-sm font-bold text-gray-400">#{{ index + 1 }}</span>
                <span class="text-sm font-mono font-semibold text-gray-900">
                  {{ member.member_id }}
                </span>
                <BaseBadge
                  :variant="getRiskColor(member.avg_suspicion_score)"
                  size="sm"
                >
                  {{ (member.avg_suspicion_score * 100).toFixed(0) }}%
                </BaseBadge>
              </div>

              <div class="mt-2 grid grid-cols-3 gap-3 text-xs">
                <div>
                  <p class="text-gray-500">Flagged</p>
                  <p class="font-semibold text-gray-900">
                    {{ member.flagged_count }} / {{ member.total_claims }}
                  </p>
                </div>
                <div>
                  <p class="text-gray-500">Flag Rate</p>
                  <p class="font-semibold text-gray-900">
                    {{ getFlagRate(member).toFixed(1) }}%
                  </p>
                </div>
                <div>
                  <p class="text-gray-500">Total Amount</p>
                  <p class="font-semibold text-gray-900">
                    {{ formatCurrency(member.total_amount) }}
                  </p>
                </div>
              </div>

              <!-- Progress bar for flag rate -->
              <div class="mt-3">
                <div class="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    :class="[
                      'h-full transition-all duration-300',
                      getFlagRate(member) >= 50 ? 'bg-red-500' :
                      getFlagRate(member) >= 25 ? 'bg-amber-500' : 'bg-blue-500'
                    ]"
                    :style="{ width: `${getFlagRate(member)}%` }"
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
