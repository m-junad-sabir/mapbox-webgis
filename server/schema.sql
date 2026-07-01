-- Run this in the Supabase SQL Editor after creating your project
-- Dashboard: https://supabase.com/dashboard → SQL Editor

CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS layers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  geometry_type TEXT,
  color TEXT DEFAULT '#2563eb',
  visible BOOLEAN DEFAULT TRUE,
  opacity NUMERIC DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  layer_id UUID NOT NULL REFERENCES layers(id) ON DELETE CASCADE,
  geometry GEOMETRY(Geometry, 4326) NOT NULL,
  properties JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS features_layer_id_idx ON features(layer_id);
CREATE INDEX IF NOT EXISTS features_geom_idx ON features USING GIST (geometry);

CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  center JSONB NOT NULL,
  zoom NUMERIC NOT NULL,
  bearing NUMERIC DEFAULT 0,
  pitch NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_id UUID REFERENCES features(id) ON DELETE SET NULL,
  geometry GEOMETRY(Point, 4326) NOT NULL,
  issue TEXT NOT NULL,
  remarks TEXT,
  status TEXT DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS flags_geom_idx ON flags USING GIST (geometry);
