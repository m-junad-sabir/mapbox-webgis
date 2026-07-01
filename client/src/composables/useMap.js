import { onUnmounted } from 'vue'
import maplibregl from 'maplibre-gl'
import { MaplibreTerradrawControl } from '@watergis/maplibre-gl-terradraw'
import { useMapStore } from '@/stores/mapStore'
import { resolveMapStyle, DEFAULT_MAP_VIEW } from '@/utils/mapConfig'

export function useMap(containerRef) {
  const mapStore = useMapStore()
  let map = null
  let drawControl = null

  function initMap() {
    if (!containerRef.value || map) return map

    map = new maplibregl.Map({
      container: containerRef.value,
      style: resolveMapStyle(mapStore.activeBasemap),
      center: mapStore.center,
      zoom: mapStore.zoom,
      bearing: mapStore.bearing,
      pitch: mapStore.pitch,
      attributionControl: false,
    })

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right')
    map.addControl(new maplibregl.ScaleControl({ maxWidth: 120 }), 'bottom-left')
    map.addControl(new maplibregl.FullscreenControl(), 'top-right')
    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right')

    drawControl = new MaplibreTerradrawControl({
      modes: [
        'point',
        'linestring',
        'polygon',
        'rectangle',
        'circle',
        'select',
        'delete-selection',
        'delete',
      ],
      open: false,
    })
    map.addControl(drawControl, 'top-left')
    mapStore.setDrawControl(drawControl)

    map.on('load', () => {
      syncViewState()
    })

    map.on('move', syncViewState)
    map.on('mousemove', (e) => {
      mapStore.setCursorCoordinates({
        lng: e.lngLat.lng,
        lat: e.lngLat.lat,
      })
    })
    map.on('zoom', updateScale)
    map.on('moveend', updateScale)

    mapStore.setMapInstance(map)
    return map
  }

  function syncViewState() {
    if (!map) return
    mapStore.updateViewState({
      center: map.getCenter().toArray(),
      zoom: map.getZoom(),
      bearing: map.getBearing(),
      pitch: map.getPitch(),
    })
    updateScale()
  }

  function updateScale() {
    if (!map) return
    const meters = map.getScale()
    if (meters >= 1000) {
      mapStore.setScale(`${(meters / 1000).toFixed(1)} km`)
    } else {
      mapStore.setScale(`${Math.round(meters)} m`)
    }
  }

  function setBasemap(basemapId) {
    if (!map) return
    map.setStyle(resolveMapStyle(basemapId))
    mapStore.setBasemap(basemapId)
  }

  function destroyMap() {
    drawControl = null
    mapStore.setDrawControl(null)
    mapStore.setMapInstance(null)
    map?.remove()
    map = null
  }

  onUnmounted(destroyMap)

  return {
    initMap,
    setBasemap,
    destroyMap,
    getMap: () => map,
  }
}

export { DEFAULT_MAP_VIEW }
