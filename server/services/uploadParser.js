export async function parseUploadFile(file) {
  const ext = file.originalname.split('.').pop()?.toLowerCase()

  if (ext === 'geojson' || ext === 'json') {
    return parseGeoJson(file.buffer)
  }

  if (ext === 'kml') {
    const err = new Error('KML parsing will be enabled in Phase 5')
    err.status = 501
    throw err
  }

  if (ext === 'kmz') {
    const err = new Error('KMZ parsing will be enabled in Phase 5')
    err.status = 501
    throw err
  }

  if (ext === 'zip') {
    const err = new Error('Shapefile ZIP parsing will be enabled in Phase 5')
    err.status = 501
    throw err
  }

  const err = new Error(`Unsupported file type: .${ext}`)
  err.status = 400
  throw err
}

function parseGeoJson(buffer) {
  const parsed = JSON.parse(buffer.toString('utf8'))

  if (parsed.type === 'FeatureCollection') {
    return parsed
  }

  if (parsed.type === 'Feature') {
    return { type: 'FeatureCollection', features: [parsed] }
  }

  if (parsed.type && parsed.coordinates) {
    return {
      type: 'FeatureCollection',
      features: [{ type: 'Feature', geometry: parsed, properties: {} }],
    }
  }

  const err = new Error('Invalid GeoJSON structure')
  err.status = 400
  throw err
}
