import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

export interface KeyboardShortcut {
  key: string
  description: string
  action: () => void
  modifier?: 'ctrl' | 'alt' | 'shift' | 'meta'
}

export function useKeyboardShortcuts() {
  const router = useRouter()
  const showCommandPalette = ref(false)
  const showHelpModal = ref(false)

  // Define all keyboard shortcuts
  const shortcuts: Record<string, KeyboardShortcut> = {
    // Command Palette
    'mod+k': {
      key: 'k',
      description: 'Open command palette',
      modifier: 'meta',
      action: () => {
        showCommandPalette.value = !showCommandPalette.value
      }
    },
    // Navigation shortcuts
    'd': {
      key: 'd',
      description: 'Go to Dashboard',
      action: () => router.push('/app/dashboard')
    },
    'c': {
      key: 'c',
      description: 'Go to Claims',
      action: () => router.push('/app/claims')
    },
    'f': {
      key: 'f',
      description: 'Go to Flagged Claims',
      action: () => router.push('/app/audit/flagged')
    },
    'u': {
      key: 'u',
      description: 'Go to Upload Claims',
      action: () => router.push('/app/claims/upload')
    },
    'a': {
      key: 'a',
      description: 'Go to Audit Results',
      action: () => router.push('/app/audit/dashboard')
    },
    // Help
    '?': {
      key: '?',
      description: 'Show keyboard shortcuts',
      action: () => {
        showHelpModal.value = !showHelpModal.value
      }
    }
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in input fields
    const target = event.target as HTMLElement
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.contentEditable === 'true'
    ) {
      // Allow Cmd+K/Ctrl+K even in input fields
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        showCommandPalette.value = !showCommandPalette.value
      }
      return
    }

    // Check for modifier + key combinations (Cmd/Ctrl + K)
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault()
      shortcuts['mod+k'].action()
      return
    }

    // Check for single key shortcuts
    const key = event.key.toLowerCase()
    const shortcut = shortcuts[key]

    if (shortcut) {
      event.preventDefault()
      shortcut.action()
    }
  }

  const registerShortcuts = () => {
    document.addEventListener('keydown', handleKeyDown)
  }

  const unregisterShortcuts = () => {
    document.removeEventListener('keydown', handleKeyDown)
  }

  onMounted(() => {
    registerShortcuts()
  })

  onUnmounted(() => {
    unregisterShortcuts()
  })

  return {
    shortcuts,
    showCommandPalette,
    showHelpModal,
    registerShortcuts,
    unregisterShortcuts
  }
}
