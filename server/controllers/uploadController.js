import { supabase } from '../config/supabase.js'
import { parseUploadFile } from '../services/uploadParser.js'

export async function uploadFile(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const geojson = await parseUploadFile(req.file)
    const geometryType = inferGeometryType(geojson)
    const layerName = req.file.originalname.replace(/\.[^.]+$/, '')

    const { data: layer, error: layerError } = await supabase
      .from('layers')
      .insert({
        name: layerName,
        geometry_type: geometryType,
        color: '#2563eb',
      })
      .select()
      .single()

    if (layerError) throw layerError

    const features = (geojson.features ?? []).map((feature) => ({
      layer_id: layer.id,
      geometry: feature.geometry,
      properties: feature.properties ?? {},
    }))

    if (features.length) {
      const { error: featureError } = await supabase.from('features').insert(features)
      if (featureError) throw featureError
    }

    res.status(201).json({
      layer: { ...layer, visible: true, opacity: 1 },
      featureCount: features.length,
    })
  } catch (err) {
    next(err)
  }
}

function inferGeometryType(geojson) {
  const first = geojson.features?.[0]?.geometry?.type
  if (!first) return 'Unknown'
  if (first.includes('Point')) return 'Point'
  if (first.includes('Line')) return 'LineString'
  if (first.includes('Polygon')) return 'Polygon'
  return first
}
