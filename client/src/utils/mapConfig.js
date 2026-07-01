// MapTiler API key — set VITE_MAPTILER_API_KEY in client/.env
// Sign up: https://cloud.maptiler.com/account/keys/
export const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_API_KEY || ''

export const BASEMAPS = {
  streets: {
    id: 'streets',
    label: 'Streets',
    style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`,
  },
  satellite: {
    id: 'satellite',
    label: 'Satellite',
    style: `https://api.maptiler.com/maps/satellite/style.json?key=${MAPTILER_KEY}`,
  },
  hybrid: {
    id: 'hybrid',
    label: 'Hybrid',
    style: `https://api.maptiler.com/maps/hybrid/style.json?key=${MAPTILER_KEY}`,
  },
  terrain: {
    id: 'terrain',
    label: 'Terrain',
    style: `https://api.maptiler.com/maps/topographique/style.json?key=${MAPTILER_KEY}`,
  },
  dark: {
    id: 'dark',
    label: 'Dark',
    style: `https://api.maptiler.com/maps/dataviz-dark/style.json?key=${MAPTILER_KEY}`,
  },
  light: {
    id: 'light',
    label: 'Light',
    style: `https://api.maptiler.com/maps/dataviz/style.json?key=${MAPTILER_KEY}`,
  },
}

export const DEFAULT_BASEMAP = 'streets'

export const DEFAULT_MAP_VIEW = {
  center: [70.61036, 30.63806],
  zoom: 5,
  bearing: 0,
  pitch: 0,
}

export function getBasemapStyle(basemapId) {
  return BASEMAPS[basemapId]?.style ?? BASEMAPS.streets.style
}

export function getFallbackStyle() {
  return 'https://demotiles.maplibre.org/style.json'
}

export function resolveMapStyle(basemapId) {
  if (MAPTILER_KEY) {
    return getBasemapStyle(basemapId)
  }
  return getFallbackStyle()
}
