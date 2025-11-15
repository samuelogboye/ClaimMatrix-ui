<template>
  <nav class="flex" aria-label="Breadcrumb">
    <ol role="list" class="flex items-center space-x-2">
      <li>
        <div>
          <router-link to="/dashboard" class="text-gray-400 hover:text-gray-500">
            <HomeIcon class="h-5 w-5 flex-shrink-0" aria-hidden="true" />
            <span class="sr-only">Home</span>
          </router-link>
        </div>
      </li>
      <li v-for="(page, index) in pages" :key="page.name">
        <div class="flex items-center">
          <ChevronRightIcon class="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
          <router-link
            v-if="page.href && index < pages.length - 1"
            :to="page.href"
            class="ml-2 text-sm font-medium text-gray-500 hover:text-gray-700"
            :aria-current="index === pages.length - 1 ? 'page' : undefined"
          >
            {{ page.name }}
          </router-link>
          <span
            v-else
            class="ml-2 text-sm font-medium text-gray-900"
            :aria-current="index === pages.length - 1 ? 'page' : undefined"
          >
            {{ page.name }}
          </span>
        </div>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { HomeIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'

export interface BreadcrumbPage {
  name: string
  href?: string
}

interface Props {
  pages: BreadcrumbPage[]
}

defineProps<Props>()
</script>
