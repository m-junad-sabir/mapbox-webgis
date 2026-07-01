import { supabase } from '../config/supabase.js'

export async function getFlags(_req, res, next) {
  try {
    const { data, error } = await supabase
      .from('flags')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    res.json(data)
  } catch (err) {
    next(err)
  }
}

export async function createFlag(req, res, next) {
  try {
    const { feature_id, geometry, issue, remarks, status } = req.body
    const { data, error } = await supabase
      .from('flags')
      .insert({
        feature_id,
        geometry,
        issue,
        remarks,
        status: status ?? 'open',
      })
      .select()
      .single()

    if (error) throw error
    res.status(201).json(data)
  } catch (err) {
    next(err)
  }
}

export async function updateFlag(req, res, next) {
  try {
    const { data, error } = await supabase
      .from('flags')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single()

    if (error) throw error
    res.json(data)
  } catch (err) {
    next(err)
  }
}

export async function deleteFlag(req, res, next) {
  try {
    const { error } = await supabase.from('flags').delete().eq('id', req.params.id)
    if (error) throw error
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}
