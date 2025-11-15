<script setup lang="ts">
import { ref, computed } from 'vue'
import { auditService } from '@/services/api/audit'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseAlert from '@/components/base/BaseAlert.vue'
import { PlayIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'
import { useToast } from 'vue-toastification'

const toast = useToast()

const claimId = ref('')
const loading = ref(false)
const success = ref(false)
const error = ref('')
const result = ref<any>(null)

const isValidClaimId = computed(() => {
  return claimId.value.trim().length > 0
})

const triggerAudit = async () => {
  if (!isValidClaimId.value) {
    error.value = 'Please enter a claim ID'
    return
  }

  loading.value = true
  error.value = ''
  success.value = false
  result.value = null

  try {
    const response = await auditService.triggerAudit(claimId.value.trim())
    result.value = response
    success.value = true
    toast.success(`Audit triggered for claim ${claimId.value}`)
  } catch (err: any) {
    error.value = err.message || 'Failed to trigger audit'
    toast.error(error.value)
  } finally {
    loading.value = false
  }
}

const reset = () => {
  claimId.value = ''
  success.value = false
  error.value = ''
  result.value = null
}
</script>

<template>
  <BaseCard>
    <div class="p-6">
      <div class="flex items-center gap-3 mb-6">
        <div class="p-2 bg-primary-50 rounded-lg">
          <PlayIcon class="h-6 w-6 text-primary-600" />
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900">Manual Audit Trigger</h3>
          <p class="text-sm text-gray-500">Trigger ML audit for a specific claim</p>
        </div>
      </div>

      <BaseAlert v-if="error" type="error" class="mb-4" closable @close="error = ''">
        {{ error }}
      </BaseAlert>

      <BaseAlert v-if="success" type="success" class="mb-4">
        <div class="flex items-center gap-2">
          <CheckCircleIcon class="h-5 w-5 text-green-600" />
          <span>Audit triggered successfully!</span>
        </div>
      </BaseAlert>

      <div v-if="!success" class="space-y-4">
        <BaseInput
          v-model="claimId"
          label="Claim ID"
          placeholder="CLM001"
          :disabled="loading"
          @keyup.enter="triggerAudit"
        />

        <BaseButton
          variant="primary"
          class="w-full"
          :loading="loading"
          :disabled="!isValidClaimId"
          @click="triggerAudit"
        >
          <PlayIcon class="w-4 h-4 mr-2" />
          Trigger Audit
        </BaseButton>

        <div class="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p class="text-sm text-amber-900">
            <span class="font-medium">Note:</span> Manual audit triggers will process the claim
            through the ML model and generate a suspicion score and flagged issues.
          </p>
        </div>
      </div>

      <div v-else class="space-y-4">
        <div class="bg-green-50 border border-green-200 rounded-lg p-4">
          <dl class="space-y-2">
            <div class="flex justify-between">
              <dt class="text-sm font-medium text-gray-600">Claim ID:</dt>
              <dd class="text-sm font-mono text-gray-900">{{ result.claim_id }}</dd>
            </div>
            <div v-if="result.task_id" class="flex justify-between">
              <dt class="text-sm font-medium text-gray-600">Task ID:</dt>
              <dd class="text-sm font-mono text-xs text-gray-900">{{ result.task_id }}</dd>
            </div>
            <div v-if="result.status" class="flex justify-between">
              <dt class="text-sm font-medium text-gray-600">Status:</dt>
              <dd class="text-sm text-gray-900">{{ result.status }}</dd>
            </div>
          </dl>
        </div>

        <div class="flex gap-3">
          <BaseButton variant="secondary" class="flex-1" @click="reset">
            Trigger Another
          </BaseButton>
          <BaseButton variant="primary" class="flex-1" @click="$router.push('/audit/flagged')">
            View Flagged Claims
          </BaseButton>
        </div>
      </div>
    </div>
  </BaseCard>
</template>
