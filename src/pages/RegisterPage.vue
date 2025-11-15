<script setup lang="ts">
import { computed } from 'vue'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'
import { useAuth } from '@/composables/useAuth'
import { getPasswordStrength } from '@/utils/validators'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseAlert from '@/components/base/BaseAlert.vue'
import { UserIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/vue/24/outline'

// Validation schema
const schema = yup.object({
  name: yup.string().required('Name is required').min(1, 'Name is required').max(255, 'Name is too long'),
  email: yup.string().required('Email is required').email('Invalid email format'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password is too long'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match')
})

// Form setup
const { handleSubmit, errors, isSubmitting } = useForm({
  validationSchema: schema,
  initialValues: {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  }
})

const { value: name } = useField<string>('name')
const { value: email } = useField<string>('email')
const { value: password } = useField<string>('password')
const { value: confirmPassword } = useField<string>('confirmPassword')

const { register, error: authError } = useAuth()

// Password strength
const passwordStrength = computed(() => {
  if (!password.value) return null
  return getPasswordStrength(password.value)
})

const strengthColor = computed(() => {
  const colors = {
    weak: 'bg-red-500',
    medium: 'bg-amber-500',
    strong: 'bg-green-500'
  }
  return passwordStrength.value ? colors[passwordStrength.value] : 'bg-gray-200'
})

const strengthText = computed(() => {
  const text = {
    weak: 'Weak',
    medium: 'Medium',
    strong: 'Strong'
  }
  return passwordStrength.value ? text[passwordStrength.value] : ''
})

// Submit handler
const onSubmit = handleSubmit(async (values) => {
  try {
    await register({
      name: values.name,
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

      <!-- Register Form -->
      <BaseCard class="p-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-6">Create your account</h2>

        <!-- Error Alert -->
        <BaseAlert v-if="authError" type="error" class="mb-6">
          {{ authError }}
        </BaseAlert>

        <form @submit="onSubmit" class="space-y-6">
          <!-- Name -->
          <BaseInput
            v-model="name"
            type="text"
            label="Full Name"
            placeholder="John Doe"
            :error="errors.name"
            :leading-icon="UserIcon"
            required
            autocomplete="name"
          />

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
          <div>
            <BaseInput
              v-model="password"
              type="password"
              label="Password"
              placeholder="••••••••"
              :error="errors.password"
              :leading-icon="LockClosedIcon"
              required
              autocomplete="new-password"
            />

            <!-- Password Strength Indicator -->
            <div v-if="password" class="mt-2">
              <div class="flex items-center justify-between text-xs mb-1">
                <span class="text-gray-600">Password strength:</span>
                <span
                  :class="[
                    'font-medium',
                    passwordStrength === 'weak' && 'text-red-600',
                    passwordStrength === 'medium' && 'text-amber-600',
                    passwordStrength === 'strong' && 'text-green-600'
                  ]"
                >
                  {{ strengthText }}
                </span>
              </div>
              <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  :class="['h-full transition-all duration-300', strengthColor]"
                  :style="{
                    width:
                      passwordStrength === 'weak'
                        ? '33%'
                        : passwordStrength === 'medium'
                          ? '66%'
                          : '100%'
                  }"
                ></div>
              </div>
            </div>
          </div>

          <!-- Confirm Password -->
          <BaseInput
            v-model="confirmPassword"
            type="password"
            label="Confirm Password"
            placeholder="••••••••"
            :error="errors.confirmPassword"
            :leading-icon="LockClosedIcon"
            required
            autocomplete="new-password"
          />

          <!-- Submit Button -->
          <BaseButton
            type="submit"
            variant="primary"
            size="lg"
            class="w-full"
            :loading="isSubmitting"
          >
            Create account
          </BaseButton>
        </form>

        <!-- Login Link -->
        <p class="mt-6 text-center text-sm text-gray-600">
          Already have an account?
          <router-link to="/login" class="font-medium text-primary-600 hover:text-primary-500">
            Sign in
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
