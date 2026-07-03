import { watch, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import maplibregl from 'maplibre-gl'
import { useLayerStore } from '@/stores/layerStore'
import { useMapStore } from '@/stores/mapStore'

export function useLayerRendering() {
  const layerStore = useLayerStore()
  const mapStore = useMapStore()
  const { layers } = storeToRefs(layerStore)
  
  let map = null
  const layerSources = new Map() // layerId -> source data
  const layerRenderIds = new Map() // layerId -> { fill, line, circle } render IDs

  // Get map instance when it becomes available
  const checkMapInterval = setInterval(() => {
    const mapInstance = mapStore.getMapInstance()
    if (mapInstance) {
      map = mapInstance
      clearInterval(checkMapInterval)
      // Load existing layers when map is ready
      if (layers.value.length > 0) {
        loadExistingLayers()
      }
    }
  }, 100)

  function getLayerSourceId(layerId) {
    return `layer-${layerId}-source`
  }

  function getLayerRenderIds(layerId) {
    return {
      fill: `layer-${layerId}-fill`,
      line: `layer-${layerId}-line`,
      circle: `layer-${layerId}-circle`,
    }
  }

  async function loadLayerFeatures(layerId) {
    try {
      const response = await layerStore.loadLayerFeatures(layerId)
      // API returns GeoJSON FeatureCollection, extract features array
      return response?.features || []
    } catch (error) {
      console.error(`Failed to load features for layer ${layerId}:`, error)
      return []
    }
  }

  async function loadExistingLayers() {
    if (!map) return
    
    for (const layer of layers.value) {
      const features = await loadLayerFeatures(layer.id)
      addLayerToMap(layer, features)
    }
  }

  function addLayerToMap(layer, features) {
    if (!map) return

    const sourceId = getLayerSourceId(layer.id)
    const renderIds = getLayerRenderIds(layer.id)

    // Convert features to GeoJSON format
    const geojson = {
      type: 'FeatureCollection',
      features: features.map(f => ({
        type: 'Feature',
        id: f.id,
        geometry: f.geometry,
        properties: f.properties || {},
      })),
    }

    // Add source
    map.addSource(sourceId, {
      type: 'geojson',
      data: geojson,
    })

    layerSources.set(layer.id, geojson)

    // Add layers based on geometry type
    const color = layer.color || '#3b82f6'
    const opacity = layer.opacity ?? 1

    // Polygon fill layer
    map.addLayer({
      id: renderIds.fill,
      type: 'fill',
      source: sourceId,
      filter: ['==', ['geometry-type'], 'Polygon'],
      paint: {
        'fill-color': color,
        'fill-opacity': opacity * 0.5,
      },
    })

    // Line layer (for polygon boundaries and linestrings)
    map.addLayer({
      id: renderIds.line,
      type: 'line',
      source: sourceId,
      filter: ['any', ['==', ['geometry-type'], 'LineString'], ['==', ['geometry-type'], 'Polygon']],
      paint: {
        'line-color': color,
        'line-width': 2,
        'line-opacity': opacity,
      },
    })

    // Circle layer for points
    map.addLayer({
      id: renderIds.circle,
      type: 'circle',
      source: sourceId,
      filter: ['==', ['geometry-type'], 'Point'],
      paint: {
        'circle-radius': 6,
        'circle-color': color,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff',
        'circle-opacity': opacity,
      },
    })

    layerRenderIds.set(layer.id, renderIds)

    // Set initial visibility
    setLayerVisibility(layer.id, layer.visible !== false)
  }

  function removeLayerFromMap(layerId) {
    if (!map) return

    const renderIds = layerRenderIds.get(layerId)
    if (renderIds) {
      Object.values(renderIds).forEach(id => {
        if (map.getLayer(id)) {
          map.removeLayer(id)
        }
      })
      layerRenderIds.delete(layerId)
    }

    const sourceId = getLayerSourceId(layerId)
    if (map.getSource(sourceId)) {
      map.removeSource(sourceId)
    }

    layerSources.delete(layerId)
  }

  function setLayerVisibility(layerId, visible) {
    if (!map) return

    const renderIds = layerRenderIds.get(layerId)
    if (renderIds) {
      Object.values(renderIds).forEach(id => {
        if (map.getLayer(id)) {
          map.setLayoutProperty(id, 'visibility', visible ? 'visible' : 'none')
        }
      })
    }
  }

  function setLayerOpacity(layerId, opacity) {
    if (!map) return

    const renderIds = layerRenderIds.get(layerId)
    if (renderIds) {
      // Update fill opacity
      if (map.getLayer(renderIds.fill)) {
        map.setPaintProperty(renderIds.fill, 'fill-opacity', opacity * 0.5)
      }
      // Update line opacity
      if (map.getLayer(renderIds.line)) {
        map.setPaintProperty(renderIds.line, 'line-opacity', opacity)
      }
      // Update circle opacity
      if (map.getLayer(renderIds.circle)) {
        map.setPaintProperty(renderIds.circle, 'circle-opacity', opacity)
      }
    }
  }

  function getLayerBounds(layerId) {
    const geojson = layerSources.get(layerId)
    if (!geojson || !geojson.features.length) return null

    const bounds = new maplibregl.LngLatBounds()
    geojson.features.forEach(feature => {
      if (feature.geometry) {
        if (feature.geometry.type === 'Point') {
          bounds.extend(feature.geometry.coordinates)
        } else if (feature.geometry.coordinates) {
          feature.geometry.coordinates.forEach(coord => {
            if (Array.isArray(coord[0])) {
              coord.forEach(c => bounds.extend(c))
            } else {
              bounds.extend(coord)
            }
          })
        }
      }
    })

    return bounds
  }

  function zoomToLayer(layerId) {
    if (!map) return

    const bounds = getLayerBounds(layerId)
    if (bounds) {
      map.fitBounds(bounds, { padding: 40, maxZoom: 16 })
    }
  }

  function updateLayerData(layerId, features) {
    if (!map) return

    const sourceId = getLayerSourceId(layerId)
    const source = map.getSource(sourceId)
    
    if (source) {
      const geojson = {
        type: 'FeatureCollection',
        features: features.map(f => ({
          type: 'Feature',
          id: f.id,
          geometry: f.geometry,
          properties: f.properties || {},
        })),
      }
      source.setData(geojson)
      layerSources.set(layerId, geojson)
    }
  }

  // Watch for layer changes
  watch(layers, async (newLayers, oldLayers) => {
    if (!map) return

    // Find added layers
    const added = newLayers.filter(l => !oldLayers?.find(ol => ol.id === l.id))
    // Find removed layers
    const removed = oldLayers?.filter(ol => !newLayers.find(l => l.id === ol.id)) || []

    // Remove layers
    removed.forEach(layer => removeLayerFromMap(layer.id))

    // Add new layers
    for (const layer of added) {
      const features = await loadLayerFeatures(layer.id)
      addLayerToMap(layer, features)
    }
  }, { deep: true })

  // Watch for visibility changes
  watch(() => layers.value.map(l => ({ id: l.id, visible: l.visible !== false })), (newVis, oldVis) => {
    if (!oldVis) return
    newVis.forEach((nv, i) => {
      const ov = oldVis[i]
      if (nv.id === ov.id && nv.visible !== ov.visible) {
        setLayerVisibility(nv.id, nv.visible)
      }
    })
  }, { deep: true })

  // Watch for opacity changes
  watch(() => layers.value.map(l => ({ id: l.id, opacity: l.opacity ?? 1 })), (newOp, oldOp) => {
    if (!oldOp) return
    newOp.forEach((nv, i) => {
      const ov = oldOp[i]
      if (nv.id === ov.id && nv.opacity !== ov.opacity) {
        setLayerOpacity(nv.id, nv.opacity)
      }
    })
  }, { deep: true })

  function cleanup() {
    clearInterval(checkMapInterval)
    layerSources.forEach((_, layerId) => removeLayerFromMap(layerId))
  }

  onUnmounted(cleanup)

  return {
    addLayerToMap,
    removeLayerFromMap,
    setLayerVisibility,
    setLayerOpacity,
    zoomToLayer,
    updateLayerData,
    loadLayerFeatures,
  }
}
