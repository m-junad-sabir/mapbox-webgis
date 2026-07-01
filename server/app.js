import express from 'express'
import cors from 'cors'
import { requireSupabase } from './config/supabase.js'
import layerRoutes from './routes/layers.js'
import { layerFeaturesRouter, featureRouter } from './routes/features.js'
import uploadRoutes from './routes/upload.js'
import bookmarkRoutes from './routes/bookmarks.js'
import flagRoutes from './routes/flags.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'

const app = express()

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }))
app.use(express.json({ limit: '10mb' }))

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/layers', requireSupabase, layerRoutes)
app.use('/api/layers/:layerId/features', requireSupabase, layerFeaturesRouter)
app.use('/api/features', requireSupabase, featureRouter)
app.use('/api/upload', requireSupabase, uploadRoutes)
app.use('/api/bookmarks', requireSupabase, bookmarkRoutes)
app.use('/api/flags', requireSupabase, flagRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
