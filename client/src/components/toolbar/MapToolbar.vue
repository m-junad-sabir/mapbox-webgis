<template>
  <div
    class="pointer-events-none absolute inset-x-0 top-3 z-10 flex justify-center px-3 md:top-4"
  >
    <div
      class="pointer-events-auto flex flex-wrap items-center gap-1 rounded-xl border border-slate-200 bg-white/95 p-1 shadow-lg backdrop-blur-sm"
    >
      <ToolbarButton
        v-for="tool in tools"
        :key="tool.id"
        :label="tool.label"
        :active="activeTool === tool.id"
        @click="selectTool(tool.id)"
      >
        <span v-html="tool.icon" />
      </ToolbarButton>

      <div class="mx-1 hidden h-6 w-px bg-slate-200 sm:block" />

      <ToolbarButton label="Draw tools" :active="drawOpen" @click="toggleDraw">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.899l-3.314 1.105 1.105-3.314a4 4 0 01.899-1.414z" />
        </svg>
      </ToolbarButton>

      <ToolbarButton label="Sidebar" class="lg:hidden" @click="ui.toggleSidebar">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
        </svg>
      </ToolbarButton>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ToolbarButton from '@/components/toolbar/ToolbarButton.vue'
import { useUiStore } from '@/stores/uiStore'
import { useMapStore } from '@/stores/mapStore'

const ui = useUiStore()
const mapStore = useMapStore()
const activeTool = ref(null)
const drawOpen = ref(false)

const tools = [
  {
    id: 'identify',
    label: 'Identify',
    icon: '<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" stroke-width="2"/><path stroke-linecap="round" stroke-width="2" d="M12 2v2m0 16v2M2 12h2m16 0h2"/></svg>',
  },
  {
    id: 'measure-distance',
    label: 'Measure distance',
    icon: '<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 20h16M8 16V8m8 8V8"/></svg>',
  },
  {
    id: 'measure-area',
    label: 'Measure area',
    icon: '<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8l8-4 8 4v8l-8 4-8-4V8z"/></svg>',
  },
]

function selectTool(id) {
  activeTool.value = activeTool.value === id ? null : id
  mapStore.identifyMode = activeTool.value === 'identify'
  mapStore.measureMode =
    activeTool.value === 'measure-distance'
      ? 'distance'
      : activeTool.value === 'measure-area'
        ? 'area'
        : null
}

function toggleDraw() {
  const control = mapStore.getDrawControl()
  if (!control) return
  drawOpen.value = !drawOpen.value
  control.open = drawOpen.value
}
</script>
