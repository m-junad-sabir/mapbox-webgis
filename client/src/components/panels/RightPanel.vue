<template>
  <Transition name="panel-slide">
    <aside
      v-if="ui.rightPanelOpen"
      :class="panelClasses"
    >
      <div class="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <h2 class="text-sm font-semibold text-slate-900">{{ ui.activePanelTitle }}</h2>
        <button
          type="button"
          class="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
          aria-label="Close panel"
          @click="ui.closePanel()"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-4">
        <LayerPanel v-if="ui.activePanel === 'layers'" />
        <SearchPanel v-else-if="ui.activePanel === 'search'" />
        <UploadPanel v-else-if="ui.activePanel === 'upload'" />
        <BookmarkPanel v-else-if="ui.activePanel === 'bookmarks'" />
        <QcPanel v-else-if="ui.activePanel === 'qc'" />
        <BasemapPanel v-else-if="ui.activePanel === 'basemap'" />
      </div>
    </aside>
  </Transition>

  <div
    v-if="showOverlay"
    class="fixed inset-0 z-20 bg-black/30 md:hidden"
    @click="ui.closePanel()"
  />
</template>

<script setup>
import { computed } from 'vue'
import { useUiStore } from '@/stores/uiStore'
import { useResponsive } from '@/composables/useResponsive'
import LayerPanel from '@/components/layer/LayerPanel.vue'
import SearchPanel from '@/components/search/SearchPanel.vue'
import UploadPanel from '@/components/upload/UploadPanel.vue'
import BookmarkPanel from '@/components/bookmark/BookmarkPanel.vue'
import QcPanel from '@/components/qc/QcPanel.vue'
import BasemapPanel from '@/components/panels/BasemapPanel.vue'

const ui = useUiStore()
const { isMobile } = useResponsive()

const panelClasses = computed(() => {
  if (isMobile.value) {
    return 'fixed inset-x-0 bottom-0 z-30 flex max-h-[70vh] flex-col rounded-t-2xl border-t border-slate-200 bg-white shadow-2xl'
  }
  return 'z-20 flex w-80 shrink-0 flex-col border-l border-slate-200 bg-white shadow-lg'
})

const showOverlay = computed(() => isMobile.value && ui.rightPanelOpen)
</script>
