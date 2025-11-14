import { ref, computed, type Ref } from 'vue'
import type { PaginationMeta } from '@/types/api'

interface UsePaginationOptions {
  initialPage?: number
  initialPageSize?: number
}

export function usePagination(options: UsePaginationOptions = {}) {
  const page = ref(options.initialPage || 1)
  const pageSize = ref(options.initialPageSize || 20)
  const totalItems = ref(0)
  const totalPages = ref(0)

  const hasNext = computed(() => page.value < totalPages.value)
  const hasPrevious = computed(() => page.value > 1)

  /**
   * Set pagination from API response
   */
  const setPagination = (meta: PaginationMeta) => {
    page.value = meta.page
    pageSize.value = meta.page_size
    totalItems.value = meta.total_items
    totalPages.value = meta.total_pages
  }

  /**
   * Go to next page
   */
  const nextPage = () => {
    if (hasNext.value) {
      page.value++
    }
  }

  /**
   * Go to previous page
   */
  const previousPage = () => {
    if (hasPrevious.value) {
      page.value--
    }
  }

  /**
   * Go to specific page
   */
  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages.value) {
      page.value = newPage
    }
  }

  /**
   * Change page size
   */
  const changePageSize = (newSize: number) => {
    pageSize.value = newSize
    page.value = 1 // Reset to first page
  }

  /**
   * Reset pagination
   */
  const reset = () => {
    page.value = 1
    pageSize.value = options.initialPageSize || 20
    totalItems.value = 0
    totalPages.value = 0
  }

  return {
    page,
    pageSize,
    totalItems,
    totalPages,
    hasNext,
    hasPrevious,
    setPagination,
    nextPage,
    previousPage,
    goToPage,
    changePageSize,
    reset
  }
}
