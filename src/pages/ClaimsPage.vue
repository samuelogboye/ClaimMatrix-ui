<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { claimsService } from '@/services/api/claims'
import { useClaimsStore } from '@/stores/claims'
import { useDebounce } from '@/composables/useDebounce'
import type { Claim } from '@/types/api'
import ClaimsTable from '@/components/claims/ClaimsTable.vue'
import ClaimsFilterPanel from '@/components/claims/ClaimsFilterPanel.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BasePagination from '@/components/base/BasePagination.vue'
import { MagnifyingGlassIcon, FunnelIcon, ArrowUpTrayIcon, ArrowDownTrayIcon } from '@heroicons/vue/24/outline'
import { useToast } from 'vue-toastification'

const router = useRouter()
const route = useRoute()
const toast = useToast()
const claimsStore = useClaimsStore()

// State
const searchQuery = ref('')
const showFilters = ref(false)
const selectedClaims = ref<string[]>([])
const page = ref(Number(route.query.page) || 1)
const pageSize = ref(Number(route.query.pageSize) || 20)
const loading = ref(false)

// Debounced search
const debouncedSearch = useDebounce(searchQuery, 500)

// Computed
const claims = computed(() => claimsStore.list)
const pagination = computed(() => claimsStore.pagination)

// Fetch claims
const fetchClaims = async () => {
  loading.value = true
  try {
    const response = await claimsService.getAll(page.value, pageSize.value)
    claimsStore.setClaims(response.items)
    claimsStore.setPagination(response.pagination)
  } catch (error) {
    toast.error('Failed to load claims')
  } finally {
    loading.value = false
  }
}

// Handle search
watch(debouncedSearch, () => {
  // Reset to page 1 when searching
  page.value = 1
  // In production, you would filter on backend
  // For now, we'll just refetch
  fetchClaims()
})

// Handle page change
watch([page, pageSize], () => {
  // Update URL params
  router.push({
    query: {
      page: page.value,
      pageSize: pageSize.value
    }
  })
  fetchClaims()
})

// Handle filters
const handleApplyFilters = (filters: any) => {
  // In production, pass filters to API
  console.log('Applying filters:', filters)
  page.value = 1
  fetchClaims()
}

const handleResetFilters = () => {
  searchQuery.value = ''
  page.value = 1
  fetchClaims()
}

// View claim detail
const viewClaim = (claim: Claim) => {
  router.push(`/claims/${claim.claim_id}`)
}

// Export selected claims
const exportClaims = () => {
  if (selectedClaims.value.length === 0) {
    toast.warning('Please select claims to export')
    return
  }

  const selectedData = claims.value.filter((c) => selectedClaims.value.includes(c.id))

  // Create CSV
  const headers = ['Claim ID', 'Member ID', 'Provider ID', 'Service Date', 'CPT Code', 'Charge Amount']
  const rows = selectedData.map((c) => [
    c.claim_id,
    c.member_id,
    c.provider_id,
    c.date_of_service,
    c.cpt_code,
    c.charge_amount
  ])

  const csv = [headers, ...rows].map((row) => row.join(',')).join('\n')

  // Download
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `claims-export-${new Date().toISOString().split('T')[0]}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  toast.success(`Exported ${selectedClaims.value.length} claims`)
}

// Download all as CSV
const downloadAllCSV = () => {
  toast.info('Downloading all claims...')
  // In production, call API endpoint to generate full export
  exportClaims()
}

// Initialize
onMounted(() => {
  fetchClaims()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Page Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-semibold text-gray-900">Claims</h1>
            <p v-if="pagination" class="mt-1 text-sm text-gray-500">
              {{ pagination.total_items.toLocaleString() }} total claims
            </p>
          </div>

          <div class="flex gap-3">
            <BaseButton variant="secondary" @click="showFilters = !showFilters">
              <FunnelIcon class="w-4 h-4 mr-2" />
              Filters
            </BaseButton>
            <BaseButton
              variant="secondary"
              @click="exportClaims"
              :disabled="selectedClaims.length === 0"
            >
              <ArrowDownTrayIcon class="w-4 h-4 mr-2" />
              Export Selected
            </BaseButton>
            <BaseButton variant="primary" @click="$router.push('/claims/upload')">
              <ArrowUpTrayIcon class="w-4 h-4 mr-2" />
              Upload Claims
            </BaseButton>
          </div>
        </div>

        <!-- Search Bar -->
        <div class="mt-6">
          <BaseInput
            v-model="searchQuery"
            type="search"
            placeholder="Search by claim ID, member ID, or provider ID..."
            :leading-icon="MagnifyingGlassIcon"
          />
        </div>
      </div>
    </div>

    <!-- Filters Panel -->
    <Transition
      enter-active-class="transform transition ease-in-out duration-300"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transform transition ease-in-out duration-300"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <ClaimsFilterPanel
        v-if="showFilters"
        @apply="handleApplyFilters"
        @reset="handleResetFilters"
        @close="showFilters = false"
      />
    </Transition>

    <!-- Claims Table -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BaseCard :padding="false">
        <ClaimsTable
          :claims="claims"
          :loading="loading"
          :selected="selectedClaims"
          @select="selectedClaims = $event"
          @view="viewClaim"
        />

        <!-- Pagination -->
        <div v-if="pagination" class="px-6 py-4 border-t border-gray-200">
          <BasePagination
            :page="pagination.page"
            :page-size="pagination.page_size"
            :total="pagination.total_items"
            :total-pages="pagination.total_pages"
            @update:page="page = $event"
            @update:page-size="pageSize = $event"
          />
        </div>
      </BaseCard>
    </div>
  </div>
</template>

