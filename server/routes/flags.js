import { Router } from 'express'
import {
  getFlags,
  createFlag,
  updateFlag,
  deleteFlag,
} from '../controllers/flagController.js'

const router = Router()

router.get('/', getFlags)
router.post('/', createFlag)
router.put('/:id', updateFlag)
router.delete('/:id', deleteFlag)

export default router
