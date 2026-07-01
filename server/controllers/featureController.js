import { supabase } from '../config/supabase.js'

export async function getFeatures(req, res, next) {
  try {
    const { data, error } = await supabase
      .from('features')
      .select('id, layer_id, properties, geometry')
      .eq('layer_id', req.params.layerId)

    if (error) throw error

    res.json({
      type: 'FeatureCollection',
      features: data.map(toGeoJsonFeature),
    })
  } catch (err) {
    next(err)
  }
}

export async function createFeature(req, res, next) {
  try {
    const { geometry, properties } = req.body
    const { data, error } = await supabase
      .from('features')
      .insert({
        layer_id: req.params.layerId,
        geometry,
        properties: properties ?? {},
      })
      .select('id, layer_id, properties, geometry')
      .single()

    if (error) throw error
    res.status(201).json(toGeoJsonFeature(data))
  } catch (err) {
    next(err)
  }
}

export async function updateFeature(req, res, next) {
  try {
    const { data, error } = await supabase
      .from('features')
      .update(req.body)
      .eq('id', req.params.id)
      .select('id, layer_id, properties, geometry')
      .single()

    if (error) throw error
    res.json(toGeoJsonFeature(data))
  } catch (err) {
    next(err)
  }
}

export async function deleteFeature(req, res, next) {
  try {
    const { error } = await supabase.from('features').delete().eq('id', req.params.id)
    if (error) throw error
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

function toGeoJsonFeature(row) {
  return {
    type: 'Feature',
    id: row.id,
    geometry: row.geometry,
    properties: { ...row.properties, _layerId: row.layer_id },
  }
}
