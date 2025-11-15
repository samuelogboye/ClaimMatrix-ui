<template>
  <TransitionRoot :show="isOpen" as="template">
    <Dialog as="div" class="relative z-50" @close="emit('close')">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-900/25 backdrop-blur-sm transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6"
            >
              <div>
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100"
                    >
                      <CommandLineIcon class="h-6 w-6 text-primary-600" aria-hidden="true" />
                    </div>
                    <DialogTitle as="h3" class="text-lg font-semibold text-gray-900">
                      Keyboard Shortcuts
                    </DialogTitle>
                  </div>
                  <button
                    @click="emit('close')"
                    class="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <XMarkIcon class="h-6 w-6" />
                  </button>
                </div>

                <div class="mt-6 space-y-6">
                  <!-- General -->
                  <div>
                    <h4 class="text-sm font-medium text-gray-900 mb-3">General</h4>
                    <div class="space-y-2">
                      <div class="flex items-center justify-between py-2">
                        <span class="text-sm text-gray-600">Open command palette</span>
                        <kbd class="inline-flex items-center rounded bg-gray-100 px-2 py-1 font-mono text-xs font-semibold text-gray-700">
                          ⌘K / Ctrl+K
                        </kbd>
                      </div>
                      <div class="flex items-center justify-between py-2">
                        <span class="text-sm text-gray-600">Show keyboard shortcuts</span>
                        <kbd class="inline-flex items-center rounded bg-gray-100 px-2 py-1 font-mono text-xs font-semibold text-gray-700">
                          ?
                        </kbd>
                      </div>
                      <div class="flex items-center justify-between py-2">
                        <span class="text-sm text-gray-600">Close modal or cancel action</span>
                        <kbd class="inline-flex items-center rounded bg-gray-100 px-2 py-1 font-mono text-xs font-semibold text-gray-700">
                          Esc
                        </kbd>
                      </div>
                    </div>
                  </div>

                  <!-- Navigation -->
                  <div>
                    <h4 class="text-sm font-medium text-gray-900 mb-3">Navigation</h4>
                    <div class="space-y-2">
                      <div class="flex items-center justify-between py-2">
                        <span class="text-sm text-gray-600">Go to Dashboard</span>
                        <kbd class="inline-flex items-center rounded bg-gray-100 px-2 py-1 font-mono text-xs font-semibold text-gray-700">
                          D
                        </kbd>
                      </div>
                      <div class="flex items-center justify-between py-2">
                        <span class="text-sm text-gray-600">Go to Claims</span>
                        <kbd class="inline-flex items-center rounded bg-gray-100 px-2 py-1 font-mono text-xs font-semibold text-gray-700">
                          C
                        </kbd>
                      </div>
                      <div class="flex items-center justify-between py-2">
                        <span class="text-sm text-gray-600">Go to Flagged Claims</span>
                        <kbd class="inline-flex items-center rounded bg-gray-100 px-2 py-1 font-mono text-xs font-semibold text-gray-700">
                          F
                        </kbd>
                      </div>
                      <div class="flex items-center justify-between py-2">
                        <span class="text-sm text-gray-600">Go to Upload Claims</span>
                        <kbd class="inline-flex items-center rounded bg-gray-100 px-2 py-1 font-mono text-xs font-semibold text-gray-700">
                          U
                        </kbd>
                      </div>
                      <div class="flex items-center justify-between py-2">
                        <span class="text-sm text-gray-600">Go to Audit Results</span>
                        <kbd class="inline-flex items-center rounded bg-gray-100 px-2 py-1 font-mono text-xs font-semibold text-gray-700">
                          A
                        </kbd>
                      </div>
                    </div>
                  </div>

                  <!-- Tables -->
                  <div>
                    <h4 class="text-sm font-medium text-gray-900 mb-3">Tables</h4>
                    <div class="space-y-2">
                      <div class="flex items-center justify-between py-2">
                        <span class="text-sm text-gray-600">Navigate table rows</span>
                        <kbd class="inline-flex items-center rounded bg-gray-100 px-2 py-1 font-mono text-xs font-semibold text-gray-700">
                          ↑ / ↓
                        </kbd>
                      </div>
                      <div class="flex items-center justify-between py-2">
                        <span class="text-sm text-gray-600">Open selected item</span>
                        <kbd class="inline-flex items-center rounded bg-gray-100 px-2 py-1 font-mono text-xs font-semibold text-gray-700">
                          Enter
                        </kbd>
                      </div>
                      <div class="flex items-center justify-between py-2">
                        <span class="text-sm text-gray-600">Select/deselect item</span>
                        <kbd class="inline-flex items-center rounded bg-gray-100 px-2 py-1 font-mono text-xs font-semibold text-gray-700">
                          Space
                        </kbd>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  class="mt-6 rounded-lg bg-primary-50 border border-primary-100 px-4 py-3 text-sm text-primary-800"
                >
                  <p class="font-medium">Pro Tip</p>
                  <p class="mt-1 text-primary-700">
                    Press
                    <kbd
                      class="mx-1 rounded bg-primary-100 px-2 py-0.5 font-mono text-xs font-semibold"
                      >⌘K</kbd
                    >
                    (Mac) or
                    <kbd
                      class="mx-1 rounded bg-primary-100 px-2 py-0.5 font-mono text-xs font-semibold"
                      >Ctrl+K</kbd
                    >
                    (Windows) from anywhere to quickly navigate.
                  </p>
                </div>
              </div>

              <div class="mt-5 sm:mt-6">
                <button
                  type="button"
                  class="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-colors"
                  @click="emit('close')"
                >
                  Got it!
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import { CommandLineIcon, XMarkIcon } from '@heroicons/vue/24/outline'

interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()
</script>
