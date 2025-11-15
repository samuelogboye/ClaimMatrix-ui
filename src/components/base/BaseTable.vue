<script setup lang="ts">
interface Props {
  loading?: boolean
  emptyMessage?: string
}

withDefaults(defineProps<Props>(), {
  loading: false,
  emptyMessage: 'No data available'
})
</script>

<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <slot name="header" />
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <!-- Loading State -->
        <tr v-if="loading">
          <td colspan="100" class="px-6 py-12 text-center">
            <div class="flex items-center justify-center">
              <svg class="animate-spin h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </td>
        </tr>

        <!-- Empty State -->
        <tr v-else-if="!$slots.default">
          <td colspan="100" class="px-6 py-12 text-center text-gray-500 text-sm">
            {{ emptyMessage }}
          </td>
        </tr>

        <!-- Data Rows -->
        <slot v-else />
      </tbody>
    </table>
  </div>
</template>
