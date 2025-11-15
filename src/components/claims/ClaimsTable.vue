<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Claim } from '@/types/api'
import { formatCurrency, formatDate } from '@/utils/formatters'
import BaseTable from '@/components/base/BaseTable.vue'
import BaseBadge from '@/components/base/BaseBadge.vue'
import { EyeIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/vue/24/outline'

interface Props {
  claims: Claim[]
  loading?: boolean
  selected?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  selected: () => []
})

const emit = defineEmits<{
  (e: 'select', claimIds: string[]): void
  (e: 'view', claim: Claim): void
}>()

const sortColumn = ref<keyof Claim | null>(null)
const sortDirection = ref<'asc' | 'desc'>('asc')

const allSelected = computed(() => {
  return props.claims.length > 0 && props.claims.every((claim) => props.selected.includes(claim.id))
})

const toggleAll = () => {
  if (allSelected.value) {
    emit('select', [])
  } else {
    emit('select', props.claims.map((c) => c.id))
  }
}

const toggleClaim = (claimId: string) => {
  if (props.selected.includes(claimId)) {
    emit('select', props.selected.filter((id) => id !== claimId))
  } else {
    emit('select', [...props.selected, claimId])
  }
}

const sort = (column: keyof Claim) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = column
    sortDirection.value = 'asc'
  }
}

const sortedClaims = computed(() => {
  if (!sortColumn.value) return props.claims

  return [...props.claims].sort((a, b) => {
    const aVal = a[sortColumn.value!]
    const bVal = b[sortColumn.value!]

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDirection.value === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal)
    }

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection.value === 'asc' ? aVal - bVal : bVal - aVal
    }

    return 0
  })
})
</script>

<template>
  <BaseTable :loading="loading" empty-message="No claims found">
    <template #header>
      <tr>
        <!-- Select All -->
        <th scope="col" class="w-12 px-6 py-3">
          <input
            type="checkbox"
            :checked="allSelected"
            @change="toggleAll"
            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer"
          />
        </th>

        <!-- Sortable Headers -->
        <th
          scope="col"
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
          @click="sort('claim_id')"
        >
          <div class="flex items-center gap-1">
            <span>Claim ID</span>
            <ChevronUpIcon
              v-if="sortColumn === 'claim_id' && sortDirection === 'asc'"
              class="h-4 w-4"
            />
            <ChevronDownIcon
              v-else-if="sortColumn === 'claim_id' && sortDirection === 'desc'"
              class="h-4 w-4"
            />
          </div>
        </th>

        <th
          scope="col"
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
          @click="sort('member_id')"
        >
          <div class="flex items-center gap-1">
            <span>Member ID</span>
            <ChevronUpIcon
              v-if="sortColumn === 'member_id' && sortDirection === 'asc'"
              class="h-4 w-4"
            />
            <ChevronDownIcon
              v-else-if="sortColumn === 'member_id' && sortDirection === 'desc'"
              class="h-4 w-4"
            />
          </div>
        </th>

        <th
          scope="col"
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
          @click="sort('provider_id')"
        >
          <div class="flex items-center gap-1">
            <span>Provider ID</span>
            <ChevronUpIcon
              v-if="sortColumn === 'provider_id' && sortDirection === 'asc'"
              class="h-4 w-4"
            />
            <ChevronDownIcon
              v-else-if="sortColumn === 'provider_id' && sortDirection === 'desc'"
              class="h-4 w-4"
            />
          </div>
        </th>

        <th
          scope="col"
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
          @click="sort('date_of_service')"
        >
          <div class="flex items-center gap-1">
            <span>Service Date</span>
            <ChevronUpIcon
              v-if="sortColumn === 'date_of_service' && sortDirection === 'asc'"
              class="h-4 w-4"
            />
            <ChevronDownIcon
              v-else-if="sortColumn === 'date_of_service' && sortDirection === 'desc'"
              class="h-4 w-4"
            />
          </div>
        </th>

        <th
          scope="col"
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          CPT Code
        </th>

        <th
          scope="col"
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
          @click="sort('charge_amount')"
        >
          <div class="flex items-center gap-1">
            <span>Charge Amount</span>
            <ChevronUpIcon
              v-if="sortColumn === 'charge_amount' && sortDirection === 'asc'"
              class="h-4 w-4"
            />
            <ChevronDownIcon
              v-else-if="sortColumn === 'charge_amount' && sortDirection === 'desc'"
              class="h-4 w-4"
            />
          </div>
        </th>

        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Actions
        </th>
      </tr>
    </template>

    <tr
      v-for="claim in sortedClaims"
      :key="claim.id"
      class="hover:bg-gray-50 transition-colors"
    >
      <!-- Checkbox -->
      <td class="px-6 py-4 whitespace-nowrap">
        <input
          type="checkbox"
          :checked="selected.includes(claim.id)"
          @change="toggleClaim(claim.id)"
          class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer"
        />
      </td>

      <!-- Claim ID -->
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm font-mono font-medium text-gray-900">{{ claim.claim_id }}</div>
      </td>

      <!-- Member ID -->
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm font-mono text-gray-900">{{ claim.member_id }}</div>
      </td>

      <!-- Provider ID -->
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm font-mono text-gray-900">{{ claim.provider_id }}</div>
      </td>

      <!-- Service Date -->
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-900">{{ formatDate(claim.date_of_service) }}</div>
      </td>

      <!-- CPT Code -->
      <td class="px-6 py-4 whitespace-nowrap">
        <BaseBadge variant="neutral">{{ claim.cpt_code }}</BaseBadge>
      </td>

      <!-- Charge Amount -->
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm font-semibold text-gray-900">
          {{ formatCurrency(claim.charge_amount) }}
        </div>
      </td>

      <!-- Actions -->
      <td class="px-6 py-4 whitespace-nowrap text-sm">
        <button
          @click="emit('view', claim)"
          class="text-primary-600 hover:text-primary-900 inline-flex items-center gap-1"
        >
          <EyeIcon class="h-4 w-4" />
          <span>View</span>
        </button>
      </td>
    </tr>
  </BaseTable>
</template>
