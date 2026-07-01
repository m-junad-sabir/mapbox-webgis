<template>
  <div class="space-y-3">
    <div v-if="loading" class="text-sm text-slate-500">Loading layers…</div>
    <div v-else-if="error" class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
      {{ error }}
    </div>
    <div v-else-if="!layers.length" class="rounded-lg border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500">
      No layers yet. Upload a GIS file to get started.
    </div>

    <ul v-else class="space-y-2">
      <li
        v-for="layer in layers"
        :key="layer.id"
        :class="[
          'rounded-lg border p-3 transition-colors',
          layer.id === activeLayerId ? 'border-blue-500 bg-blue-50' : 'border-slate-200',
        ]"
      >
        <div class="flex items-start justify-between gap-2">
          <button
            type="button"
            class="text-left text-sm font-medium text-slate-900"
            @click="layerStore.setActiveLayer(layer.id)"
          >
            {{ layer.name }}
          </button>
          <button
            type="button"
            class="text-slate-400 hover:text-slate-600"
            :title="layer.visible !== false ? 'Hide layer' : 'Show layer'"
            @click="layerStore.toggleVisibility(layer.id)"
          >
            <svg v-if="layer.visible !== false" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029M6.223 6.223A9.966 9.966 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>

        <p class="mt-1 text-xs text-slate-500">{{ layer.geometry_type || 'Mixed' }}</p>

        <div class="mt-2">
          <label class="text-xs text-slate-500">Opacity</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            :value="layer.opacity ?? 1"
            class="mt-1 w-full accent-blue-600"
            @input="layerStore.setOpacity(layer.id, parseFloat($event.target.value))"
          />
        </div>

        <div class="mt-2 flex gap-2">
          <button
            type="button"
            class="rounded px-2 py-1 text-xs text-blue-600 hover:bg-blue-50"
            @click="zoomToLayer(layer.id)"
          >
            Zoom to
          </button>
          <button
            type="button"
            class="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50"
            @click="removeLayer(layer.id)"
          >
            Remove
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useLayerStore } from '@/stores/layerStore'
import { useMapStore } from '@/stores/mapStore'

const layerStore = useLayerStore()
const mapStore = useMapStore()
const { layers, activeLayerId, loading, error } = storeToRefs(layerStore)

onMounted(() => {
  layerStore.fetchLayers()
})

function zoomToLayer() {
  mapStore.flyTo({ center: mapStore.center, zoom: 8 })
}

async function removeLayer(id) {
  if (!confirm('Remove this layer?')) return
  try {
    await layerStore.removeLayer(id)
  } catch (err) {
    alert(err.message)
  }
}
</script>
