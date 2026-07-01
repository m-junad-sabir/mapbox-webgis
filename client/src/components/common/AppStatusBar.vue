<template>
  <footer class="z-30 flex h-8 shrink-0 items-center justify-between border-t border-slate-700 bg-slate-800 px-3 text-xs text-slate-300">
    <div class="flex items-center gap-3">
      <span v-if="coords">
        {{ coords.lng.toFixed(5) }}, {{ coords.lat.toFixed(5) }}
      </span>
      <span v-else>— , —</span>
    </div>

    <div class="flex items-center gap-4">
      <span>Zoom {{ zoom.toFixed(1) }}</span>
      <span v-if="scale">{{ scale }}</span>
      <span class="hidden sm:inline">Bearing {{ bearing.toFixed(0) }}°</span>
    </div>
  </footer>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useMapStore } from '@/stores/mapStore'

const mapStore = useMapStore()
const { cursorCoordinates: coords, zoom, bearing, scale } = storeToRefs(mapStore)
</script>
