<script setup lang="ts">
import { computed } from 'vue'
import type { BadgeVariant } from '@/types'

interface Props {
  variant?: BadgeVariant
  dot?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'neutral',
  dot: false
})

const variantClasses = computed(() => {
  const variants = {
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-amber-100 text-amber-800 border-amber-200',
    danger: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
    neutral: 'bg-gray-100 text-gray-800 border-gray-200'
  }
  return variants[props.variant]
})

const dotColorClasses = computed(() => {
  const colors = {
    success: 'bg-green-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
    info: 'bg-blue-500',
    neutral: 'bg-gray-500'
  }
  return colors[props.variant]
})
</script>

<template>
  <span
    :class="[
      'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border',
      variantClasses
    ]"
  >
    <span v-if="dot" :class="['h-1.5 w-1.5 rounded-full', dotColorClasses]"></span>
    <slot />
  </span>
</template>
