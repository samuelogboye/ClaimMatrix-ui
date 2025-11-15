<script setup lang="ts">
import { computed } from 'vue'
import BaseCard from '@/components/base/BaseCard.vue'

interface Props {
  title: string
  value: number | string
  change?: number
  changeLabel?: string
  icon?: any
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral'
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'neutral',
  loading: false
})

const variantClasses = computed(() => {
  const classes = {
    primary: {
      bg: 'bg-primary-50',
      border: 'border-primary-200',
      icon: 'text-primary-600',
      text: 'text-primary-900'
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: 'text-green-600',
      text: 'text-green-900'
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      icon: 'text-amber-600',
      text: 'text-amber-900'
    },
    danger: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'text-red-600',
      text: 'text-red-900'
    },
    neutral: {
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      icon: 'text-gray-600',
      text: 'text-gray-900'
    }
  }
  return classes[props.variant]
})

const changeColor = computed(() => {
  if (!props.change) return ''
  return props.change > 0 ? 'text-green-600' : 'text-red-600'
})

const changeIcon = computed(() => {
  if (!props.change) return ''
  return props.change > 0 ? '↑' : '↓'
})
</script>

<template>
  <BaseCard>
    <div class="p-6">
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <p class="text-sm font-medium text-gray-600">{{ title }}</p>

          <div v-if="loading" class="mt-2">
            <div class="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
          </div>

          <div v-else class="mt-2 flex items-baseline gap-2">
            <p class="text-3xl font-bold text-gray-900">
              {{ typeof value === 'number' ? value.toLocaleString() : value }}
            </p>

            <div v-if="change !== undefined" class="flex items-center gap-1">
              <span :class="['text-sm font-medium', changeColor]">
                {{ changeIcon }} {{ Math.abs(change) }}%
              </span>
              <span v-if="changeLabel" class="text-xs text-gray-500">
                {{ changeLabel }}
              </span>
            </div>
          </div>
        </div>

        <div v-if="icon" :class="['p-3 rounded-lg', variantClasses.bg, variantClasses.border, 'border']">
          <component :is="icon" class="h-6 w-6" :class="variantClasses.icon" />
        </div>
      </div>
    </div>
  </BaseCard>
</template>
