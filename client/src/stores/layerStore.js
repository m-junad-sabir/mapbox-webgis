import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { layerService, featureService } from '@/services/gisServices'

export const useLayerStore = defineStore('layers', () => {
  const layers = ref([])
  const activeLayerId = ref(null)
  const selectedFeature = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const activeLayer = computed(() =>
    layers.value.find((l) => l.id === activeLayerId.value) ?? null,
  )

  async function fetchLayers() {
    loading.value = true
    error.value = null
    try {
      layers.value = await layerService.getAll()
      if (!activeLayerId.value && layers.value.length) {
        activeLayerId.value = layers.value[0].id
      }
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  function setActiveLayer(id) {
    activeLayerId.value = id
  }

  function updateLayerLocal(id, patch) {
    const index = layers.value.findIndex((l) => l.id === id)
    if (index !== -1) {
      layers.value[index] = { ...layers.value[index], ...patch }
    }
  }

  function toggleVisibility(id) {
    const layer = layers.value.find((l) => l.id === id)
    if (layer) {
      layer.visible = !layer.visible
    }
  }

  function setOpacity(id, opacity) {
    updateLayerLocal(id, { opacity })
  }

  function removeLayerLocal(id) {
    layers.value = layers.value.filter((l) => l.id !== id)
    if (activeLayerId.value === id) {
      activeLayerId.value = layers.value[0]?.id ?? null
    }
  }

  async function removeLayer(id) {
    await layerService.remove(id)
    removeLayerLocal(id)
  }

  function selectFeature(feature) {
    selectedFeature.value = feature
  }

  function clearSelection() {
    selectedFeature.value = null
  }

  async function loadLayerFeatures(layerId) {
    return featureService.getByLayer(layerId)
  }

  return {
    layers,
    activeLayerId,
    activeLayer,
    selectedFeature,
    loading,
    error,
    fetchLayers,
    setActiveLayer,
    updateLayerLocal,
    toggleVisibility,
    setOpacity,
    removeLayerLocal,
    removeLayer,
    selectFeature,
    clearSelection,
    loadLayerFeatures,
  }
})
