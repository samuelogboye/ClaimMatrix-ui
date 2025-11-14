<script setup lang="ts">
interface Props {
  padding?: boolean
  hover?: boolean
}

withDefaults(defineProps<Props>(), {
  padding: true,
  hover: false
})
</script>

<template>
  <div
    :class="[
      'card',
      { 'p-6': padding },
      { 'hover:shadow-md transition-shadow duration-200': hover }
    ]"
  >
    <slot />
  </div>
</template>
