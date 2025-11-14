<script setup lang="ts">
import { ref } from 'vue'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'
import { useAuth } from '@/composables/useAuth'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseAlert from '@/components/base/BaseAlert.vue'
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/vue/24/outline'

// Validation schema
const schema = yup.object({
  email: yup.string().required('Email is required').email('Invalid email format'),
  password: yup.string().required('Password is required').min(8, 'Password must be at least 8 characters')
})

// Form setup
const { handleSubmit, errors, isSubmitting } = useForm({
  validationSchema: schema
})

const { value: email } = useField<string>('email')
const { value: password } = useField<string>('password')
const rememberMe = ref(false)

const { login, error: authError } = useAuth()

// Submit handler
const onSubmit = handleSubmit(async (values) => {
  try {
    await login({
      email: values.email,
      password: values.password
    })
  } catch (err) {
    // Error handled by useAuth
  }
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
    <div class="max-w-md w-full space-y-8">
      <!-- Logo & Title -->
      <div class="text-center">
        <div class="inline-block p-3 bg-primary-100 rounded-full mb-4">
          <svg class="h-12 w-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-900">ClaimMatrix</h1>
        <p class="mt-2 text-sm text-gray-600">Healthcare Claims Audit Platform</p>
      </div>

      <!-- Login Form -->
      <BaseCard class="p-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-6">Sign in to your account</h2>

        <!-- Error Alert -->
        <BaseAlert v-if="authError" type="error" class="mb-6">
          {{ authError }}
        </BaseAlert>

        <form @submit="onSubmit" class="space-y-6">
          <!-- Email -->
          <BaseInput
            v-model="email"
            type="email"
            label="Email address"
            placeholder="you@example.com"
            :error="errors.email"
            :leading-icon="EnvelopeIcon"
            required
            autocomplete="email"
          />

          <!-- Password -->
          <BaseInput
            v-model="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            :error="errors.password"
            :leading-icon="LockClosedIcon"
            required
            autocomplete="current-password"
          />

          <!-- Remember me & Forgot password -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="rememberMe"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-700 cursor-pointer">
                Remember me
              </label>
            </div>

            <a href="#" class="text-sm font-medium text-primary-600 hover:text-primary-500">
              Forgot password?
            </a>
          </div>

          <!-- Submit Button -->
          <BaseButton
            type="submit"
            variant="primary"
            size="lg"
            class="w-full"
            :loading="isSubmitting"
          >
            Sign in
          </BaseButton>
        </form>

        <!-- Register Link -->
        <p class="mt-6 text-center text-sm text-gray-600">
          Don't have an account?
          <router-link to="/register" class="font-medium text-primary-600 hover:text-primary-500">
            Sign up
          </router-link>
        </p>
      </BaseCard>

      <!-- Footer -->
      <p class="text-center text-xs text-gray-500">
        © 2025 ClaimMatrix. All rights reserved.
      </p>
    </div>
  </div>
</template>
