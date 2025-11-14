<script setup lang="ts">
import { computed } from 'vue'
import type { AlertType } from '@/types'
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

interface Props {
  type?: AlertType
  title?: string
  closable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  closable: false
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

const alertConfig = computed(() => {
  const configs = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: CheckCircleIcon,
      iconColor: 'text-green-500'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: XCircleIcon,
      iconColor: 'text-red-500'
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-800',
      icon: ExclamationTriangleIcon,
      iconColor: 'text-amber-500'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: InformationCircleIcon,
      iconColor: 'text-blue-500'
    }
  }
  return configs[props.type]
})
</script>

<template>
  <div
    :class="[
      'rounded-lg border p-4',
      alertConfig.bg,
      alertConfig.border,
      alertConfig.text
    ]"
  >
    <div class="flex items-start gap-3">
      <component :is="alertConfig.icon" :class="['h-5 w-5 flex-shrink-0', alertConfig.iconColor]" />

      <div class="flex-1">
        <h3 v-if="title" class="text-sm font-medium mb-1">{{ title }}</h3>
        <div class="text-sm">
          <slot />
        </div>
      </div>

      <button
        v-if="closable"
        @click="emit('close')"
        :class="['flex-shrink-0', alertConfig.iconColor, 'hover:opacity-75']"
      >
        <XMarkIcon class="h-5 w-5" />
      </button>
    </div>
  </div>
</template>
