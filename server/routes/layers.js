import { Router } from 'express'
import {
  getLayers,
  createLayer,
  updateLayer,
  deleteLayer,
} from '../controllers/layerController.js'

const router = Router()

router.get('/', getLayers)
router.post('/', createLayer)
router.put('/:id', updateLayer)
router.delete('/:id', deleteLayer)

export default router
