import { Router } from 'express'
import multer from 'multer'
import { uploadFile } from '../controllers/uploadController.js'

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
})

const router = Router()
router.post('/', upload.single('file'), uploadFile)

export default router
