<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useKeyboardShortcuts } from '@/composables/useKeyboardShortcuts'
import CommandPalette from '@/components/base/CommandPalette.vue'
import KeyboardShortcutsModal from '@/components/base/KeyboardShortcutsModal.vue'
import OfflineBanner from '@/components/base/OfflineBanner.vue'

// Enable keyboard shortcuts globally
const { showCommandPalette, showHelpModal } = useKeyboardShortcuts()
</script>

<template>
  <div>
    <!-- Offline Detection Banner -->
    <OfflineBanner />

    <RouterView />

    <!-- Command Palette (Cmd+K / Ctrl+K) -->
    <CommandPalette :is-open="showCommandPalette" @close="showCommandPalette = false" />

    <!-- Keyboard Shortcuts Help (?) -->
    <KeyboardShortcutsModal :is-open="showHelpModal" @close="showHelpModal = false" />
  </div>
</template>

<style>
/* Global app styles */
</style>
