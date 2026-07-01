<template>
  <div class="space-y-3">
    <p
      v-if="!maptilerKey"
      class="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800"
    >
      Add <code class="font-mono">VITE_MAPTILER_API_KEY</code> in <code class="font-mono">client/.env</code>
      for MapTiler basemaps. See
      <a href="https://cloud.maptiler.com/account/keys/" target="_blank" rel="noopener" class="underline">MapTiler keys</a>.
    </p>

    <div class="grid grid-cols-2 gap-2">
      <button
        v-for="basemap in basemaps"
        :key="basemap.id"
        type="button"
        :class="[
          'rounded-lg border px-3 py-3 text-left text-sm transition-colors',
          activeBasemap === basemap.id
            ? 'border-blue-600 bg-blue-50 text-blue-700'
            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50',
        ]"
        @click="selectBasemap(basemap.id)"
      >
        {{ basemap.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { BASEMAPS, MAPTILER_KEY, resolveMapStyle } from '@/utils/mapConfig'
import { useMapStore } from '@/stores/mapStore'

const mapStore = useMapStore()
const { activeBasemap } = storeToRefs(mapStore)

const basemaps = computed(() => Object.values(BASEMAPS))
const maptilerKey = MAPTILER_KEY

function selectBasemap(id) {
  mapStore.setBasemap(id)
  const map = mapStore.getMapInstance()
  if (map) {
    map.setStyle(resolveMapStyle(id))
  }
}
</script>
