<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'

interface Props {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:page', value: number): void
  (e: 'update:pageSize', value: number): void
}>()

const hasNext = computed(() => props.page < props.totalPages)
const hasPrevious = computed(() => props.page > 1)

const startItem = computed(() => {
  return props.total === 0 ? 0 : (props.page - 1) * props.pageSize + 1
})

const endItem = computed(() => {
  return Math.min(props.page * props.pageSize, props.total)
})

const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const delta = 2

  if (props.totalPages <= 7) {
    for (let i = 1; i <= props.totalPages; i++) {
      pages.push(i)
    }
  } else {
    if (props.page <= 3) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('...')
      pages.push(props.totalPages)
    } else if (props.page >= props.totalPages - 2) {
      pages.push(1)
      pages.push('...')
      for (let i = props.totalPages - 4; i <= props.totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = props.page - delta; i <= props.page + delta; i++) pages.push(i)
      pages.push('...')
      pages.push(props.totalPages)
    }
  }

  return pages
})

const goToPage = (page: number) => {
  if (page >= 1 && page <= props.totalPages && page !== props.page) {
    emit('update:page', page)
  }
}

const changePageSize = (size: number) => {
  emit('update:pageSize', size)
  emit('update:page', 1)
}
</script>

<template>
  <div class="flex items-center justify-between">
    <!-- Info -->
    <div class="flex-1 flex justify-between sm:hidden">
      <button
        @click="goToPage(page - 1)"
        :disabled="!hasPrevious"
        class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <button
        @click="goToPage(page + 1)"
        :disabled="!hasNext"
        class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>

    <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-700">
          Showing
          <span class="font-medium">{{ startItem }}</span>
          to
          <span class="font-medium">{{ endItem }}</span>
          of
          <span class="font-medium">{{ total.toLocaleString() }}</span>
          results
        </p>
      </div>

      <div class="flex items-center gap-4">
        <!-- Page Size Selector -->
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-700">Per page:</label>
          <select
            :value="pageSize"
            @change="changePageSize(Number(($event.target as HTMLSelectElement).value))"
            class="border border-gray-300 rounded-md text-sm py-1 px-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
        </div>

        <!-- Page Numbers -->
        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          <!-- Previous -->
          <button
            @click="goToPage(page - 1)"
            :disabled="!hasPrevious"
            class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeftIcon class="h-5 w-5" />
          </button>

          <!-- Page Numbers -->
          <button
            v-for="(pageNum, index) in visiblePages"
            :key="index"
            @click="typeof pageNum === 'number' ? goToPage(pageNum) : null"
            :disabled="typeof pageNum !== 'number'"
            :class="[
              'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
              pageNum === page
                ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50',
              typeof pageNum !== 'number' && 'cursor-default'
            ]"
          >
            {{ pageNum }}
          </button>

          <!-- Next -->
          <button
            @click="goToPage(page + 1)"
            :disabled="!hasNext"
            class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRightIcon class="h-5 w-5" />
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>
