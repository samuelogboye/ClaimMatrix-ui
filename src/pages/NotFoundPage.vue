<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <h1 class="text-9xl font-bold text-primary-500">404</h1>
      <h2 class="text-2xl font-semibold text-gray-900 mt-4">Page Not Found</h2>
      <p class="text-gray-600 mt-2">The page you're looking for doesn't exist.</p>
      <button
        @click="goHome"
        class="mt-6 px-6 py-3 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
      >
        Go Home
      </button>
    </div>
  </div>
</template>
