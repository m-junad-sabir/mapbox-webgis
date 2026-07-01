<template>
  <aside
    :class="[
      'z-20 flex shrink-0 flex-col border-r border-slate-200 bg-slate-900 text-slate-100 transition-all duration-300',
      sidebarClasses,
    ]"
  >
    <div class="flex items-center justify-between border-b border-slate-700 px-3 py-3">
      <span class="text-sm font-semibold tracking-wide">Tools</span>
      <button
        type="button"
        class="rounded p-1 hover:bg-slate-700 lg:hidden"
        aria-label="Close sidebar"
        @click="ui.sidebarOpen = false"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <nav class="flex-1 space-y-1 overflow-y-auto p-2">
      <SidebarItem
        v-for="item in navItems"
        :key="item.id"
        :icon="item.icon"
        :label="item.label"
        :active="ui.activePanel === item.id && ui.rightPanelOpen"
        @click="ui.togglePanel(item.id)"
      />
    </nav>
  </aside>

  <div
    v-if="showOverlay"
    class="fixed inset-0 z-10 bg-black/40 lg:hidden"
    @click="ui.sidebarOpen = false"
  />
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import SidebarItem from '@/components/sidebar/SidebarItem.vue'
import { useUiStore } from '@/stores/uiStore'
import { useResponsive } from '@/composables/useResponsive'

const ui = useUiStore()
const { sidebarOpen } = storeToRefs(ui)
const { isMobile, isTablet } = useResponsive()

const navItems = [
  { id: 'layers', label: 'Layers', icon: 'layers' },
  { id: 'search', label: 'Search', icon: 'search' },
  { id: 'upload', label: 'Upload', icon: 'upload' },
  { id: 'bookmarks', label: 'Bookmarks', icon: 'bookmark' },
  { id: 'qc', label: 'QC Flags', icon: 'flag' },
  { id: 'basemap', label: 'Basemaps', icon: 'map' },
]

const sidebarClasses = computed(() => {
  if (isMobile.value || isTablet.value) {
    return sidebarOpen.value
      ? 'fixed inset-y-14 left-0 w-56 shadow-xl'
      : 'fixed inset-y-14 -left-56 w-56 shadow-xl'
  }
  return sidebarOpen.value ? 'w-56' : 'w-14'
})

const showOverlay = computed(
  () => (isMobile.value || isTablet.value) && sidebarOpen.value,
)
</script>
