<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseBadge from '@/components/base/BaseBadge.vue'
import BaseAlert from '@/components/base/BaseAlert.vue'
import BaseModal from '@/components/base/BaseModal.vue'

const loading = ref(false)
const inputValue = ref('')
const showModal = ref(false)

const handleButtonClick = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 2000)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-5xl mx-auto space-y-8">
      <!-- Header -->
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">ClaimMatrix UI</h1>
        <p class="text-gray-600">Week 1 - Design System Showcase</p>
      </div>

      <!-- Buttons -->
      <BaseCard>
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">Buttons</h2>
        <div class="flex flex-wrap gap-4">
          <BaseButton variant="primary" @click="handleButtonClick" :loading="loading">
            Primary Button
          </BaseButton>
          <BaseButton variant="secondary">Secondary Button</BaseButton>
          <BaseButton variant="ghost">Ghost Button</BaseButton>
          <BaseButton variant="danger">Danger Button</BaseButton>
        </div>
        <div class="flex flex-wrap gap-4 mt-4">
          <BaseButton variant="primary" size="sm">Small</BaseButton>
          <BaseButton variant="primary" size="md">Medium</BaseButton>
          <BaseButton variant="primary" size="lg">Large</BaseButton>
        </div>
      </BaseCard>

      <!-- Inputs -->
      <BaseCard>
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">Inputs</h2>
        <div class="space-y-4 max-w-md">
          <BaseInput
            v-model="inputValue"
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            required
          />
          <BaseInput
            v-model="inputValue"
            label="Password"
            type="password"
            placeholder="••••••••"
          />
          <BaseInput
            v-model="inputValue"
            label="With Error"
            error="This field is required"
          />
        </div>
      </BaseCard>

      <!-- Badges -->
      <BaseCard>
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">Badges</h2>
        <div class="flex flex-wrap gap-3">
          <BaseBadge variant="success">Success</BaseBadge>
          <BaseBadge variant="warning">Warning</BaseBadge>
          <BaseBadge variant="danger">Danger</BaseBadge>
          <BaseBadge variant="info">Info</BaseBadge>
          <BaseBadge variant="neutral">Neutral</BaseBadge>
        </div>
        <div class="flex flex-wrap gap-3 mt-4">
          <BaseBadge variant="success" dot>High Risk</BaseBadge>
          <BaseBadge variant="warning" dot>Medium Risk</BaseBadge>
          <BaseBadge variant="danger" dot>Low Risk</BaseBadge>
        </div>
      </BaseCard>

      <!-- Alerts -->
      <BaseCard>
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">Alerts</h2>
        <div class="space-y-4">
          <BaseAlert type="success" title="Success!">
            Your changes have been saved successfully.
          </BaseAlert>
          <BaseAlert type="error" title="Error">
            There was an error processing your request.
          </BaseAlert>
          <BaseAlert type="warning" title="Warning">
            This action cannot be undone.
          </BaseAlert>
          <BaseAlert type="info">
            This is an informational message without a title.
          </BaseAlert>
        </div>
      </BaseCard>

      <!-- Modal -->
      <BaseCard>
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">Modal</h2>
        <BaseButton variant="primary" @click="showModal = true">
          Open Modal
        </BaseButton>

        <BaseModal v-model="showModal" title="Example Modal" size="md">
          <p class="text-gray-600">
            This is an example modal component using HeadlessUI. It supports multiple sizes,
            custom titles, and footer slots.
          </p>

          <template #footer>
            <div class="flex justify-end gap-3">
              <BaseButton variant="secondary" @click="showModal = false">
                Cancel
              </BaseButton>
              <BaseButton variant="primary" @click="showModal = false">
                Confirm
              </BaseButton>
            </div>
          </template>
        </BaseModal>
      </BaseCard>

      <!-- Color Palette -->
      <BaseCard>
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">Color Palette</h2>
        <div class="space-y-4">
          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-2">Primary (Sky Blue)</h3>
            <div class="flex gap-2">
              <div class="h-16 w-16 rounded-lg bg-primary-500 border border-gray-200"></div>
              <div class="h-16 w-16 rounded-lg bg-primary-600 border border-gray-200"></div>
              <div class="h-16 w-16 rounded-lg bg-primary-700 border border-gray-200"></div>
            </div>
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-2">Semantic Colors</h3>
            <div class="flex gap-2">
              <div class="h-16 w-16 rounded-lg bg-green-500 border border-gray-200"></div>
              <div class="h-16 w-16 rounded-lg bg-amber-500 border border-gray-200"></div>
              <div class="h-16 w-16 rounded-lg bg-red-500 border border-gray-200"></div>
              <div class="h-16 w-16 rounded-lg bg-blue-500 border border-gray-200"></div>
            </div>
          </div>
        </div>
      </BaseCard>

      <!-- Footer -->
      <div class="text-center text-sm text-gray-500 pt-8">
        ClaimMatrix UI - Week 1 Complete ✅
      </div>
    </div>
  </div>
</template>
