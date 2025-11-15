<template>
  <TransitionRoot :show="isOpen" as="template" @after-leave="query = ''" appear>
    <Dialog as="div" class="relative z-50" @close="closeModal">
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

      <div class="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0 scale-95"
          enter-to="opacity-100 scale-100"
          leave="ease-in duration-200"
          leave-from="opacity-100 scale-100"
          leave-to="opacity-0 scale-95"
        >
          <DialogPanel
            class="mx-auto max-w-2xl transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all"
          >
            <!-- Search Input -->
            <Combobox @update:modelValue="onSelect">
              <div class="relative">
                <MagnifyingGlassIcon
                  class="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                <ComboboxInput
                  class="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                  placeholder="Search or jump to..."
                  @change="query = $event.target.value"
                  @keydown.esc="closeModal"
                />
              </div>

              <!-- Results -->
              <ComboboxOptions
                v-if="filteredCommands.length > 0"
                static
                class="max-h-96 scroll-py-3 overflow-y-auto p-3"
              >
                <ComboboxOption
                  v-for="command in filteredCommands"
                  :key="command.id"
                  :value="command"
                  as="template"
                  v-slot="{ active }"
                >
                  <li
                    :class="[
                      'flex cursor-pointer select-none rounded-md p-3 transition-colors',
                      active ? 'bg-primary-50 text-primary-900' : 'text-gray-900'
                    ]"
                  >
                    <component
                      :is="command.icon"
                      :class="[
                        'h-6 w-6 flex-none',
                        active ? 'text-primary-600' : 'text-gray-400'
                      ]"
                      aria-hidden="true"
                    />
                    <div class="ml-3 flex-auto">
                      <p class="text-sm font-medium">{{ command.name }}</p>
                      <p :class="['text-xs', active ? 'text-primary-700' : 'text-gray-500']">
                        {{ command.description }}
                      </p>
                    </div>
                    <kbd
                      v-if="command.shortcut"
                      :class="[
                        'ml-3 flex-none text-xs font-semibold px-2 py-1 rounded',
                        active ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-500'
                      ]"
                    >
                      {{ command.shortcut }}
                    </kbd>
                  </li>
                </ComboboxOption>
              </ComboboxOptions>

              <!-- No Results -->
              <div
                v-if="query !== '' && filteredCommands.length === 0"
                class="px-6 py-14 text-center text-sm sm:px-14"
              >
                <FolderIcon class="mx-auto h-6 w-6 text-gray-400" aria-hidden="true" />
                <p class="mt-4 font-semibold text-gray-900">No results found</p>
                <p class="mt-2 text-gray-500">
                  No commands found for this search term. Please try again.
                </p>
              </div>
            </Combobox>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption
} from '@headlessui/vue'
import {
  MagnifyingGlassIcon,
  HomeIcon,
  DocumentTextIcon,
  FlagIcon,
  ArrowUpTrayIcon,
  ClipboardDocumentCheckIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  FolderIcon
} from '@heroicons/vue/24/outline'

interface Command {
  id: string
  name: string
  description: string
  icon: any
  action: () => void
  shortcut?: string
}

interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const router = useRouter()
const query = ref('')

const commands = ref<Command[]>([
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'View analytics and insights',
    icon: HomeIcon,
    shortcut: 'D',
    action: () => router.push('/dashboard')
  },
  {
    id: 'claims',
    name: 'All Claims',
    description: 'Browse all healthcare claims',
    icon: DocumentTextIcon,
    shortcut: 'C',
    action: () => router.push('/claims')
  },
  {
    id: 'flagged',
    name: 'Flagged Claims',
    description: 'View potentially fraudulent claims',
    icon: FlagIcon,
    shortcut: 'F',
    action: () => router.push('/audit/flagged')
  },
  {
    id: 'upload',
    name: 'Upload Claims',
    description: 'Upload claims via CSV file',
    icon: ArrowUpTrayIcon,
    shortcut: 'U',
    action: () => router.push('/claims/upload')
  },
  {
    id: 'audit',
    name: 'Audit Results',
    description: 'View audit results and statistics',
    icon: ClipboardDocumentCheckIcon,
    shortcut: 'A',
    action: () => router.push('/audit/results')
  },
  {
    id: 'audit-dashboard',
    name: 'Audit Dashboard',
    description: 'ML audit controls and monitoring',
    icon: ChartBarIcon,
    action: () => router.push('/audit/dashboard')
  },
  {
    id: 'settings',
    name: 'Settings',
    description: 'Manage your account and preferences',
    icon: Cog6ToothIcon,
    action: () => router.push('/settings')
  }
])

const filteredCommands = computed(() => {
  if (query.value === '') {
    return commands.value
  }

  return commands.value.filter((command) => {
    const searchTerm = query.value.toLowerCase()
    return (
      command.name.toLowerCase().includes(searchTerm) ||
      command.description.toLowerCase().includes(searchTerm)
    )
  })
})

const closeModal = () => {
  emit('close')
}

const onSelect = (command: Command) => {
  if (command) {
    command.action()
    closeModal()
  }
}
</script>
