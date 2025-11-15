<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseButton from '@/components/base/BaseButton.vue'
import {
  HomeIcon,
  DocumentTextIcon,
  FlagIcon,
  ChartBarIcon,
  ArrowUpTrayIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const sidebarOpen = ref(false)

const navigation = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: HomeIcon
  },
  {
    name: 'Claims',
    path: '/claims',
    icon: DocumentTextIcon
  },
  {
    name: 'Upload Claims',
    path: '/claims/upload',
    icon: ArrowUpTrayIcon
  },
  {
    name: 'Audit Dashboard',
    path: '/audit/dashboard',
    icon: ChartBarIcon
  },
  {
    name: 'Flagged Claims',
    path: '/audit/flagged',
    icon: FlagIcon
  }
]

const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(path + '/')
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Mobile sidebar backdrop -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
      @click="sidebarOpen = false"
    ></div>

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <div class="h-full flex flex-col">
        <!-- Logo -->
        <div class="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <h1 class="text-xl font-bold text-primary-600">ClaimMatrix</h1>
          <button
            @click="sidebarOpen = false"
            class="lg:hidden text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon class="h-6 w-6" />
          </button>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <router-link
            v-for="item in navigation"
            :key="item.path"
            :to="item.path"
            :class="[
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              isActive(item.path)
                ? 'bg-primary-50 text-primary-700'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            ]"
            @click="sidebarOpen = false"
          >
            <component :is="item.icon" class="h-5 w-5 flex-shrink-0" />
            {{ item.name }}
          </router-link>
        </nav>

        <!-- User Menu -->
        <div class="border-t border-gray-200 p-4">
          <div v-if="authStore.user" class="mb-3">
            <p class="text-sm font-medium text-gray-900">{{ authStore.user.name }}</p>
            <p class="text-xs text-gray-500">{{ authStore.user.email }}</p>
          </div>
          <BaseButton
            variant="ghost"
            size="sm"
            class="w-full justify-start"
            @click="handleLogout"
          >
            <ArrowRightOnRectangleIcon class="h-4 w-4 mr-2" />
            Logout
          </BaseButton>
        </div>
      </div>
    </aside>

    <!-- Main content -->
    <div class="lg:pl-64">
      <!-- Mobile header -->
      <div class="lg:hidden sticky top-0 z-10 bg-white border-b border-gray-200">
        <div class="h-16 flex items-center justify-between px-4">
          <button
            @click="sidebarOpen = true"
            class="text-gray-400 hover:text-gray-500"
          >
            <Bars3Icon class="h-6 w-6" />
          </button>
          <h1 class="text-xl font-bold text-primary-600">ClaimMatrix</h1>
          <div class="w-6"></div>
        </div>
      </div>

      <!-- Page content -->
      <RouterView />
    </div>
  </div>
</template>
