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

// Allow requests from your specific Vercel production domain
const allowedOrigins = [
  'https://gis-editing-crud-o2mm30csj-muhammad-junaid-sabirs-projects.vercel.app', // Your production frontend
  'http://localhost:5173',                        // Local development (Vite)
  'https://supabase.com/dashboard/project/zuynkvjtwpfvfxsymhwj', // Supabase database
];

//app.use(cors({ origin: allowedOrigins }))

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

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
