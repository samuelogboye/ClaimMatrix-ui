<script setup lang="ts">
import { computed } from 'vue'
import type { ButtonVariant, ButtonSize } from '@/types'
import BaseSpinner from './BaseSpinner.vue'

interface Props {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  type: 'button'
})

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }
  return sizes[props.size]
})

const variantClasses = computed(() => {
  const variants = {
    primary:
      'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500 shadow-sm',
    secondary:
      'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 border border-gray-300',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-sm'
  }
  return variants[props.variant]
})

const spinnerSize = computed(() => {
  const sizes = {
    sm: 'sm',
    md: 'sm',
    lg: 'md'
  }
  return sizes[props.size]
})
</script>

<template>
  <button
    :type="type"
    :disabled="loading || disabled"
    :class="[
      'btn-base',
      sizeClasses,
      variantClasses,
      { 'cursor-not-allowed opacity-50': loading || disabled }
    ]"
  >
    <BaseSpinner v-if="loading" :size="spinnerSize" class="mr-2" />
    <slot />
  </button>
</template>
