import { supabase } from '../config/supabase.js'

export async function getBookmarks(_req, res, next) {
  try {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    res.json(data)
  } catch (err) {
    next(err)
  }
}

export async function createBookmark(req, res, next) {
  try {
    const { name, center, zoom, bearing, pitch } = req.body
    const { data, error } = await supabase
      .from('bookmarks')
      .insert({ name, center, zoom, bearing: bearing ?? 0, pitch: pitch ?? 0 })
      .select()
      .single()

    if (error) throw error
    res.status(201).json(data)
  } catch (err) {
    next(err)
  }
}

export async function deleteBookmark(req, res, next) {
  try {
    const { error } = await supabase.from('bookmarks').delete().eq('id', req.params.id)
    if (error) throw error
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}
