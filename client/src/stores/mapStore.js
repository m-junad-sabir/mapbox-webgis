import { defineStore } from 'pinia'
import { ref } from 'vue'
import { DEFAULT_MAP_VIEW, DEFAULT_BASEMAP } from '@/utils/mapConfig'

export const useMapStore = defineStore('map', () => {
  const center = ref([...DEFAULT_MAP_VIEW.center])
  const zoom = ref(DEFAULT_MAP_VIEW.zoom)
  const bearing = ref(DEFAULT_MAP_VIEW.bearing)
  const pitch = ref(DEFAULT_MAP_VIEW.pitch)
  const activeBasemap = ref(DEFAULT_BASEMAP)
  const cursorCoordinates = ref(null)
  const scale = ref('')
  const isFullscreen = ref(false)
  const identifyMode = ref(false)
  const measureMode = ref(null)

  let mapInstance = null
  let drawControl = null

  function setMapInstance(map) {
    mapInstance = map
  }

  function getMapInstance() {
    return mapInstance
  }

  function setDrawControl(control) {
    drawControl = control
  }

  function getDrawControl() {
    return drawControl
  }

  function updateViewState(view) {
    if (view.center) center.value = [...view.center]
    if (view.zoom != null) zoom.value = view.zoom
    if (view.bearing != null) bearing.value = view.bearing
    if (view.pitch != null) pitch.value = view.pitch
  }

  function setCursorCoordinates(lngLat) {
    cursorCoordinates.value = lngLat
  }

  function setScale(value) {
    scale.value = value
  }

  function setBasemap(id) {
    activeBasemap.value = id
  }

  function flyTo(options) {
    mapInstance?.flyTo({ essential: true, ...options })
  }

  function fitBounds(bounds, options = {}) {
    mapInstance?.fitBounds(bounds, { padding: 40, ...options })
  }

  return {
    center,
    zoom,
    bearing,
    pitch,
    activeBasemap,
    cursorCoordinates,
    scale,
    isFullscreen,
    identifyMode,
    measureMode,
    setMapInstance,
    getMapInstance,
    setDrawControl,
    getDrawControl,
    updateViewState,
    setCursorCoordinates,
    setScale,
    setBasemap,
    flyTo,
    fitBounds,
  }
})
