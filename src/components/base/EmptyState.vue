<template>
  <div class="text-center py-12">
    <component
      :is="icon"
      class="mx-auto h-12 w-12 text-gray-400"
      aria-hidden="true"
    />
    <h3 class="mt-4 text-sm font-semibold text-gray-900">{{ title }}</h3>
    <p class="mt-2 text-sm text-gray-500">{{ description }}</p>
    <div v-if="$slots.action || actionLabel" class="mt-6">
      <slot name="action">
        <BaseButton v-if="actionLabel" :variant="actionVariant" @click="$emit('action')">
          <component v-if="actionIcon" :is="actionIcon" class="-ml-0.5 mr-1.5 h-5 w-5" />
          {{ actionLabel }}
        </BaseButton>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Component } from 'vue'
import BaseButton from './BaseButton.vue'

interface Props {
  icon: Component
  title: string
  description: string
  actionLabel?: string
  actionIcon?: Component
  actionVariant?: 'primary' | 'secondary' | 'ghost' | 'danger'
}

interface Emits {
  (e: 'action'): void
}

withDefaults(defineProps<Props>(), {
  actionVariant: 'primary'
})

defineEmits<Emits>()
</script>
