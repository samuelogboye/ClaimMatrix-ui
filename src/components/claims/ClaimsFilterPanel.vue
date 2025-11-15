<script setup lang="ts">
import { ref } from 'vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

interface FilterValues {
  memberId: string
  providerId: string
  cptCode: string
  dateFrom: string
  dateTo: string
  minAmount: string
  maxAmount: string
}

const emit = defineEmits<{
  (e: 'apply', filters: FilterValues): void
  (e: 'reset'): void
  (e: 'close'): void
}>()

const filters = ref<FilterValues>({
  memberId: '',
  providerId: '',
  cptCode: '',
  dateFrom: '',
  dateTo: '',
  minAmount: '',
  maxAmount: ''
})

const applyFilters = () => {
  emit('apply', { ...filters.value })
  emit('close')
}

const resetFilters = () => {
  filters.value = {
    memberId: '',
    providerId: '',
    cptCode: '',
    dateFrom: '',
    dateTo: '',
    minAmount: '',
    maxAmount: ''
  }
  emit('reset')
  emit('close')
}
</script>

<template>
  <div class="fixed inset-0 overflow-hidden z-50" role="dialog" aria-modal="true">
    <div class="absolute inset-0 overflow-hidden">
      <!-- Backdrop -->
      <div
        class="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        @click="emit('close')"
      ></div>

      <!-- Panel -->
      <div class="fixed inset-y-0 right-0 pl-10 max-w-full flex">
        <div class="w-screen max-w-md">
          <div class="h-full flex flex-col bg-white shadow-xl">
            <!-- Header -->
            <div class="px-6 py-6 bg-gray-50 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold text-gray-900">Filter Claims</h2>
                <button
                  @click="emit('close')"
                  class="text-gray-400 hover:text-gray-500"
                >
                  <XMarkIcon class="h-6 w-6" />
                </button>
              </div>
            </div>

            <!-- Filters -->
            <div class="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              <!-- Member ID -->
              <BaseInput
                v-model="filters.memberId"
                label="Member ID"
                placeholder="MEM123"
              />

              <!-- Provider ID -->
              <BaseInput
                v-model="filters.providerId"
                label="Provider ID"
                placeholder="PRV456"
              />

              <!-- CPT Code -->
              <BaseInput
                v-model="filters.cptCode"
                label="CPT Code"
                placeholder="99213"
              />

              <!-- Date Range -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Service Date Range
                </label>
                <div class="grid grid-cols-2 gap-3">
                  <BaseInput
                    v-model="filters.dateFrom"
                    type="date"
                    label="From"
                  />
                  <BaseInput
                    v-model="filters.dateTo"
                    type="date"
                    label="To"
                  />
                </div>
              </div>

              <!-- Charge Amount Range -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Charge Amount Range
                </label>
                <div class="grid grid-cols-2 gap-3">
                  <BaseInput
                    v-model="filters.minAmount"
                    type="number"
                    label="Min"
                    placeholder="0"
                  />
                  <BaseInput
                    v-model="filters.maxAmount"
                    type="number"
                    label="Max"
                    placeholder="10000"
                  />
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex-shrink-0 px-6 py-4 border-t border-gray-200 flex gap-3">
              <BaseButton variant="secondary" class="flex-1" @click="resetFilters">
                Reset
              </BaseButton>
              <BaseButton variant="primary" class="flex-1" @click="applyFilters">
                Apply Filters
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
