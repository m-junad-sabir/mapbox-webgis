import { createClient } from '@supabase/supabase-js'

// Supabase credentials — set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in server/.env
// Dashboard: https://supabase.com/dashboard → Project Settings → API
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    '[config] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing. API will return errors until configured.',
  )
}

export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null

export function requireSupabase(_req, res, next) {
  if (!supabase) {
    return res.status(503).json({
      error: 'Database not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in server/.env',
    })
  }
  next()
}
