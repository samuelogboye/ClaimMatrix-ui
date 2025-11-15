<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Page Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumbs :pages="breadcrumbs" />
        <h1 class="mt-4 text-2xl font-semibold text-gray-900">Settings</h1>
        <p class="mt-1 text-sm text-gray-500">Manage your account settings and preferences</p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Settings Navigation -->
        <div class="lg:col-span-1">
          <nav class="space-y-1">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                activeTab === tab.id
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              ]"
            >
              <component :is="tab.icon" class="mr-3 h-5 w-5" />
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <!-- Settings Content -->
        <div class="lg:col-span-3">
          <!-- Profile Settings -->
          <BaseCard v-if="activeTab === 'profile'" class="p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-6">Profile Information</h2>

            <form @submit.prevent="handleSaveProfile" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <BaseInput
                  v-model="form.name"
                  label="Full Name"
                  type="text"
                  placeholder="John Doe"
                  required
                />

                <BaseInput
                  v-model="form.email"
                  label="Email Address"
                  type="email"
                  placeholder="john@example.com"
                  required
                  disabled
                />
              </div>

              <div class="flex items-center justify-between pt-4 border-t border-gray-200">
                <p class="text-sm text-gray-500">
                  Account created on {{ formatDate(user?.created_at) }}
                </p>
                <BaseButton type="submit" variant="primary" :loading="saving">
                  Save Changes
                </BaseButton>
              </div>
            </form>
          </BaseCard>

          <!-- Notification Settings -->
          <BaseCard v-if="activeTab === 'notifications'" class="p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-6">Notification Preferences</h2>

            <div class="space-y-6">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h3 class="text-sm font-medium text-gray-900">Email Notifications</h3>
                  <p class="mt-1 text-sm text-gray-500">
                    Receive email notifications for important updates
                  </p>
                </div>
                <button
                  @click="toggleNotification('email')"
                  type="button"
                  :class="[
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                    notifications.email ? 'bg-primary-600' : 'bg-gray-200'
                  ]"
                  role="switch"
                  :aria-checked="notifications.email"
                >
                  <span
                    :class="[
                      'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                      notifications.email ? 'translate-x-5' : 'translate-x-0'
                    ]"
                  />
                </button>
              </div>

              <div class="flex items-start justify-between border-t border-gray-200 pt-6">
                <div class="flex-1">
                  <h3 class="text-sm font-medium text-gray-900">Flagged Claims Alerts</h3>
                  <p class="mt-1 text-sm text-gray-500">
                    Get notified when new high-risk claims are detected
                  </p>
                </div>
                <button
                  @click="toggleNotification('flaggedClaims')"
                  type="button"
                  :class="[
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                    notifications.flaggedClaims ? 'bg-primary-600' : 'bg-gray-200'
                  ]"
                  role="switch"
                  :aria-checked="notifications.flaggedClaims"
                >
                  <span
                    :class="[
                      'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                      notifications.flaggedClaims ? 'translate-x-5' : 'translate-x-0'
                    ]"
                  />
                </button>
              </div>

              <div class="flex items-start justify-between border-t border-gray-200 pt-6">
                <div class="flex-1">
                  <h3 class="text-sm font-medium text-gray-900">Weekly Reports</h3>
                  <p class="mt-1 text-sm text-gray-500">
                    Receive weekly summary reports of audit activity
                  </p>
                </div>
                <button
                  @click="toggleNotification('weeklyReports')"
                  type="button"
                  :class="[
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                    notifications.weeklyReports ? 'bg-primary-600' : 'bg-gray-200'
                  ]"
                  role="switch"
                  :aria-checked="notifications.weeklyReports"
                >
                  <span
                    :class="[
                      'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                      notifications.weeklyReports ? 'translate-x-5' : 'translate-x-0'
                    ]"
                  />
                </button>
              </div>
            </div>
          </BaseCard>

          <!-- Security Settings -->
          <BaseCard v-if="activeTab === 'security'" class="p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-6">Security</h2>

            <div class="space-y-6">
              <div class="rounded-lg bg-amber-50 border border-amber-200 p-4">
                <div class="flex">
                  <ShieldExclamationIcon class="h-5 w-5 text-amber-400" />
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-amber-800">Change Password</h3>
                    <p class="mt-2 text-sm text-amber-700">
                      Password management is handled through the authentication system. Contact your
                      administrator to reset your password.
                    </p>
                  </div>
                </div>
              </div>

              <div class="border-t border-gray-200 pt-6">
                <h3 class="text-sm font-medium text-gray-900 mb-4">Active Sessions</h3>
                <div class="space-y-3">
                  <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div class="flex items-center gap-3">
                      <ComputerDesktopIcon class="h-5 w-5 text-gray-400" />
                      <div>
                        <p class="text-sm font-medium text-gray-900">Current Session</p>
                        <p class="text-xs text-gray-500">Windows • Chrome</p>
                      </div>
                    </div>
                    <BaseBadge variant="success">Active</BaseBadge>
                  </div>
                </div>
              </div>
            </div>
          </BaseCard>

          <!-- Preferences -->
          <BaseCard v-if="activeTab === 'preferences'" class="p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-6">Preferences</h2>

            <div class="space-y-6">
              <div>
                <label class="text-sm font-medium text-gray-900 block mb-2">
                  Default Page Size
                </label>
                <select
                  v-model="preferences.pageSize"
                  class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                >
                  <option :value="10">10 items per page</option>
                  <option :value="20">20 items per page</option>
                  <option :value="50">50 items per page</option>
                  <option :value="100">100 items per page</option>
                </select>
              </div>

              <div class="border-t border-gray-200 pt-6">
                <label class="text-sm font-medium text-gray-900 block mb-2">
                  Date Format
                </label>
                <select
                  v-model="preferences.dateFormat"
                  class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>

              <div class="border-t border-gray-200 pt-6">
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <h3 class="text-sm font-medium text-gray-900">Keyboard Shortcuts</h3>
                    <p class="mt-1 text-sm text-gray-500">
                      Enable keyboard shortcuts for faster navigation
                    </p>
                  </div>
                  <button
                    @click="preferences.keyboardShortcuts = !preferences.keyboardShortcuts"
                    type="button"
                    :class="[
                      'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                      preferences.keyboardShortcuts ? 'bg-primary-600' : 'bg-gray-200'
                    ]"
                    role="switch"
                    :aria-checked="preferences.keyboardShortcuts"
                  >
                    <span
                      :class="[
                        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                        preferences.keyboardShortcuts ? 'translate-x-5' : 'translate-x-0'
                      ]"
                    />
                  </button>
                </div>
              </div>

              <div class="pt-4 border-t border-gray-200">
                <BaseButton @click="handleSavePreferences" variant="primary" :loading="saving">
                  Save Preferences
                </BaseButton>
              </div>
            </div>
          </BaseCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { formatDate } from '@/utils/formatters'
import { useToast } from 'vue-toastification'
import {
  UserCircleIcon,
  BellIcon,
  ShieldCheckIcon,
  Cog6ToothIcon,
  ShieldExclamationIcon,
  ComputerDesktopIcon
} from '@heroicons/vue/24/outline'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseBadge from '@/components/base/BaseBadge.vue'
import Breadcrumbs, { type BreadcrumbPage } from '@/components/base/Breadcrumbs.vue'

const authStore = useAuthStore()
const toast = useToast()
const { user } = authStore

const breadcrumbs: BreadcrumbPage[] = [{ name: 'Settings' }]

const activeTab = ref('profile')
const saving = ref(false)

const tabs = [
  { id: 'profile', name: 'Profile', icon: UserCircleIcon },
  { id: 'notifications', name: 'Notifications', icon: BellIcon },
  { id: 'security', name: 'Security', icon: ShieldCheckIcon },
  { id: 'preferences', name: 'Preferences', icon: Cog6ToothIcon }
]

const form = ref({
  name: user?.name || '',
  email: user?.email || ''
})

const notifications = ref({
  email: true,
  flaggedClaims: true,
  weeklyReports: false
})

const preferences = ref({
  pageSize: 20,
  dateFormat: 'MM/DD/YYYY',
  keyboardShortcuts: true
})

const handleSaveProfile = async () => {
  saving.value = true
  try {
    // TODO: Implement API call to update profile
    await new Promise((resolve) => setTimeout(resolve, 1000))
    toast.success('Profile updated successfully')
  } catch (error) {
    toast.error('Failed to update profile')
  } finally {
    saving.value = false
  }
}

const handleSavePreferences = async () => {
  saving.value = true
  try {
    // TODO: Save to localStorage or API
    localStorage.setItem('user-preferences', JSON.stringify(preferences.value))
    await new Promise((resolve) => setTimeout(resolve, 500))
    toast.success('Preferences saved successfully')
  } catch (error) {
    toast.error('Failed to save preferences')
  } finally {
    saving.value = false
  }
}

const toggleNotification = (type: keyof typeof notifications.value) => {
  notifications.value[type] = !notifications.value[type]
  toast.success(`${type} notifications ${notifications.value[type] ? 'enabled' : 'disabled'}`)
}
</script>
