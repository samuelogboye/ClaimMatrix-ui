<template>
  <Transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="!isOnline" class="fixed top-0 left-0 right-0 z-50">
      <div class="bg-amber-600 px-4 py-3 shadow-lg">
        <div class="flex items-center justify-center">
          <div class="flex items-center gap-3">
            <WifiIcon class="h-5 w-5 text-white animate-pulse" />
            <p class="text-sm font-medium text-white">
              You are currently offline. Some features may be limited.
            </p>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { WifiIcon } from '@heroicons/vue/24/outline'
import { useOnlineStatus } from '@/composables/useOnlineStatus'

const { isOnline } = useOnlineStatus()
</script>
