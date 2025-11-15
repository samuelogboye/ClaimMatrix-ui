<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { claimsService } from '@/services/api/claims'
import { formatFileSize } from '@/utils/formatters'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseAlert from '@/components/base/BaseAlert.vue'
import {
  CloudArrowUpIcon,
  DocumentIcon,
  CheckCircleIcon,
  ArrowDownTrayIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'
import { useToast } from 'vue-toastification'

const router = useRouter()
const toast = useToast()

const isDragging = ref(false)
const selectedFile = ref<File | null>(null)
const csvPreview = ref<any>(null)
const uploading = ref(false)
const uploadComplete = ref(false)
const uploadResult = ref<any>(null)
const errorMessage = ref('')

const maxFileSize = Number(import.meta.env.VITE_UPLOAD_MAX_SIZE) || 52428800 // 50MB

// File input ref
const fileInput = ref<HTMLInputElement | null>(null)

// Handle drag events
const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = true
}

const handleDragLeave = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false

  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    handleFileSelect(files[0])
  }
}

// Handle file selection
const handleFileSelect = async (file?: File) => {
  const selectedFileFromInput = file || fileInput.value?.files?.[0]

  if (!selectedFileFromInput) return

  // Validate file type
  if (!selectedFileFromInput.name.endsWith('.csv')) {
    errorMessage.value = 'Only CSV files are allowed'
    toast.error('Only CSV files are allowed')
    return
  }

  // Validate file size
  if (selectedFileFromInput.size > maxFileSize) {
    errorMessage.value = `File size exceeds maximum allowed size of ${formatFileSize(maxFileSize)}`
    toast.error(errorMessage.value)
    return
  }

  selectedFile.value = selectedFileFromInput
  errorMessage.value = ''

  // Preview CSV
  await previewCSV(selectedFileFromInput)
}

// Preview CSV file
const previewCSV = async (file: File) => {
  try {
    const text = await file.text()
    const lines = text.split('\n').filter((line) => line.trim())

    if (lines.length === 0) {
      errorMessage.value = 'CSV file is empty'
      return
    }

    const headers = lines[0].split(',').map((h) => h.trim())
    const rows = lines.slice(1, 11).map((line) => {
      const values = line.split(',').map((v) => v.trim())
      return headers.reduce((obj: any, header, index) => {
        obj[header] = values[index] || ''
        return obj
      }, {})
    })

    // Validate required columns
    const requiredColumns = [
      'claim_id',
      'member_id',
      'provider_id',
      'date_of_service',
      'cpt_code',
      'charge_amount'
    ]

    const missingColumns = requiredColumns.filter(
      (col) => !headers.map((h) => h.toLowerCase()).includes(col.toLowerCase())
    )

    if (missingColumns.length > 0) {
      errorMessage.value = `Missing required columns: ${missingColumns.join(', ')}`
      toast.error(errorMessage.value)
      csvPreview.value = null
      return
    }

    csvPreview.value = {
      headers,
      rows,
      totalRows: lines.length - 1
    }
  } catch (error) {
    errorMessage.value = 'Failed to parse CSV file'
    toast.error('Failed to parse CSV file')
  }
}

// Upload file
const uploadFile = async () => {
  if (!selectedFile.value) return

  uploading.value = true
  errorMessage.value = ''

  try {
    const response = await claimsService.uploadCSV(selectedFile.value)
    uploadResult.value = response
    uploadComplete.value = true
    toast.success('File uploaded successfully!')
  } catch (error: any) {
    errorMessage.value = error.message || 'Upload failed'
    toast.error(errorMessage.value)
  } finally {
    uploading.value = false
  }
}

// Reset upload
const resetUpload = () => {
  selectedFile.value = null
  csvPreview.value = null
  uploadComplete.value = false
  uploadResult.value = null
  errorMessage.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// Download template
const downloadTemplate = () => {
  const headers = ['claim_id', 'member_id', 'provider_id', 'date_of_service', 'cpt_code', 'charge_amount']
  const example = ['CLM001', 'MEM123', 'PRV456', '2025-01-10', '99213', '150.00']
  const csv = [headers.join(','), example.join(',')].join('\n')

  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'claims-template.csv'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  toast.success('Template downloaded')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-semibold text-gray-900">Upload Claims</h1>
            <p class="mt-1 text-sm text-gray-500">
              Upload a CSV file containing claims data
            </p>
          </div>
          <BaseButton variant="secondary" @click="downloadTemplate">
            <ArrowDownTrayIcon class="w-4 h-4 mr-2" />
            Download Template
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Error Alert -->
      <BaseAlert v-if="errorMessage" type="error" class="mb-6" closable @close="errorMessage = ''">
        {{ errorMessage }}
      </BaseAlert>

      <!-- Upload Area -->
      <BaseCard v-if="!uploadComplete" class="p-8">
        <!-- Drag & Drop Zone -->
        <div
          @drop="handleDrop"
          @dragover="handleDragOver"
          @dragleave="handleDragLeave"
          :class="[
            'border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer',
            isDragging
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 hover:border-gray-400'
          ]"
          @click="fileInput?.click()"
        >
          <CloudArrowUpIcon class="mx-auto h-12 w-12 text-gray-400" />
          <p class="mt-4 text-sm text-gray-600">
            Drag and drop your CSV file here, or
            <label class="text-primary-600 hover:text-primary-500 cursor-pointer font-medium">
              browse
              <input
                ref="fileInput"
                type="file"
                accept=".csv"
                class="hidden"
                @change="handleFileSelect()"
              />
            </label>
          </p>
          <p class="mt-2 text-xs text-gray-500">
            CSV up to {{ formatFileSize(maxFileSize) }} • Required columns: claim_id, member_id,
            provider_id, date_of_service, cpt_code, charge_amount
          </p>
        </div>

        <!-- File Preview -->
        <div v-if="selectedFile" class="mt-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <DocumentIcon class="h-10 w-10 text-primary-500" />
              <div>
                <p class="font-medium text-gray-900">{{ selectedFile.name }}</p>
                <p class="text-sm text-gray-500">{{ formatFileSize(selectedFile.size) }}</p>
              </div>
            </div>
            <BaseButton variant="ghost" size="sm" @click="resetUpload">
              <XMarkIcon class="h-5 w-5" />
            </BaseButton>
          </div>

          <!-- CSV Preview Table -->
          <div v-if="csvPreview" class="overflow-x-auto border border-gray-200 rounded-lg">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    v-for="header in csvPreview.headers"
                    :key="header"
                    class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    {{ header }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(row, idx) in csvPreview.rows" :key="idx">
                  <td
                    v-for="(value, key) in row"
                    :key="key"
                    class="px-3 py-2 text-sm text-gray-900 whitespace-nowrap"
                  >
                    {{ value }}
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="bg-gray-50 px-3 py-2 border-t border-gray-200">
              <p class="text-xs text-gray-500">
                Showing first {{ csvPreview.rows.length }} of
                {{ csvPreview.totalRows.toLocaleString() }} rows
              </p>
            </div>
          </div>

          <!-- Upload Button -->
          <div class="mt-6">
            <BaseButton
              variant="primary"
              class="w-full"
              size="lg"
              :loading="uploading"
              :disabled="!csvPreview"
              @click="uploadFile"
            >
              Upload {{ csvPreview?.totalRows.toLocaleString() || 0 }} claims
            </BaseButton>
          </div>
        </div>
      </BaseCard>

      <!-- Upload Complete -->
      <BaseCard v-else class="p-8">
        <div class="text-center">
          <CheckCircleIcon class="mx-auto h-16 w-16 text-success" />
          <h3 class="mt-4 text-xl font-semibold text-gray-900">Upload Complete!</h3>
          <p class="mt-2 text-gray-600">
            Your claims file has been uploaded and is being processed
          </p>

          <div v-if="uploadResult" class="mt-6 bg-gray-50 rounded-lg p-4">
            <dl class="space-y-2 text-sm">
              <div class="flex justify-between">
                <dt class="text-gray-600">Filename:</dt>
                <dd class="font-medium text-gray-900">{{ uploadResult.filename }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-gray-600">Task ID:</dt>
                <dd class="font-mono text-xs text-gray-900">{{ uploadResult.task_id }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-gray-600">Status:</dt>
                <dd class="font-medium text-gray-900">{{ uploadResult.status }}</dd>
              </div>
            </dl>
          </div>

          <div class="mt-8 flex gap-3 justify-center">
            <BaseButton variant="secondary" @click="resetUpload">
              Upload Another
            </BaseButton>
            <BaseButton variant="primary" @click="$router.push('/app/claims')">
              View Claims
            </BaseButton>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

