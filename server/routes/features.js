import { Router } from 'express'
import {
  getFeatures,
  createFeature,
  updateFeature,
  deleteFeature,
} from '../controllers/featureController.js'

const layerFeaturesRouter = Router({ mergeParams: true })
layerFeaturesRouter.get('/', getFeatures)
layerFeaturesRouter.post('/', createFeature)

const featureRouter = Router()
featureRouter.put('/:id', updateFeature)
featureRouter.delete('/:id', deleteFeature)

export { layerFeaturesRouter, featureRouter }
