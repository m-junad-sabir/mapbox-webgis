import { supabase } from '../config/supabase.js'

export async function getLayers(_req, res, next) {
  try {
    const { data, error } = await supabase
      .from('layers')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    res.json(data.map(normalizeLayer))
  } catch (err) {
    next(err)
  }
}

export async function createLayer(req, res, next) {
  try {
    const { name, geometry_type, color } = req.body
    const { data, error } = await supabase
      .from('layers')
      .insert({ name, geometry_type, color })
      .select()
      .single()

    if (error) throw error
    res.status(201).json(normalizeLayer(data))
  } catch (err) {
    next(err)
  }
}

export async function updateLayer(req, res, next) {
  try {
    const { data, error } = await supabase
      .from('layers')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single()

    if (error) throw error
    res.json(normalizeLayer(data))
  } catch (err) {
    next(err)
  }
}

export async function deleteLayer(req, res, next) {
  try {
    const { error } = await supabase.from('layers').delete().eq('id', req.params.id)
    if (error) throw error
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

function normalizeLayer(layer) {
  return {
    ...layer,
    visible: layer.visible ?? true,
    opacity: layer.opacity ?? 1,
  }
}
