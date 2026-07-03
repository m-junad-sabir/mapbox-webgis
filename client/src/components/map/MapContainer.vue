<template>
  <div ref="mapContainer" class="absolute inset-0 h-full w-full" />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMap } from '@/composables/useMap'
import { useLayerRendering } from '@/composables/useLayerRendering'
import { useMapStore } from '@/stores/mapStore'

const mapContainer = ref(null)
const mapStore = useMapStore()
const { activeBasemap } = storeToRefs(mapStore)
const { initMap, setBasemap } = useMap(mapContainer)

onMounted(() => {
  initMap()
  // Initialize layer rendering after map is ready
  useLayerRendering()
})

watch(activeBasemap, (id) => {
  setBasemap(id)
})
</script>

<style scoped>
:deep(.maplibregl-ctrl-top-left) {
  top: 4.5rem;
}

@media (min-width: 768px) {
  :deep(.maplibregl-ctrl-top-left) {
    top: 1rem;
  }
}
</style>
