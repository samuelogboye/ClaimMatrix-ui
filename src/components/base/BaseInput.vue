<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: string | number
  type?: string
  label?: string
  placeholder?: string
  error?: string
  disabled?: boolean
  required?: boolean
  leadingIcon?: any
  trailingIcon?: any
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  required: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'blur'): void
  (e: 'focus'): void
}>()

const hasError = computed(() => !!props.error)

const inputClasses = computed(() => {
  const base = 'input-base'
  const error = hasError.value ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
  const withLeadingIcon = props.leadingIcon ? 'pl-10' : ''
  const withTrailingIcon = props.trailingIcon ? 'pr-10' : ''
  return [base, error, withLeadingIcon, withTrailingIcon].filter(Boolean).join(' ')
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="w-full">
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1.5">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <div class="relative">
      <!-- Leading Icon -->
      <div v-if="leadingIcon" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <component :is="leadingIcon" class="h-5 w-5 text-gray-400" />
      </div>

      <input
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :class="inputClasses"
        @input="handleInput"
        @blur="emit('blur')"
        @focus="emit('focus')"
      />

      <!-- Trailing Icon -->
      <div v-if="trailingIcon" class="absolute inset-y-0 right-0 pr-3 flex items-center">
        <component :is="trailingIcon" class="h-5 w-5 text-gray-400" />
      </div>
    </div>

    <p v-if="error" class="mt-1.5 text-sm text-red-600">{{ error }}</p>
  </div>
</template>
