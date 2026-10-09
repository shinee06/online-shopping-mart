import { Router } from 'express'
import {
  getProfile,
  updateProfile,
} from '../controllers/customerController.js'
import requireAuth from '../middleware/requireAuth.js'

const router = Router()

router.use(requireAuth)
router.get('/me', getProfile)
router.put('/me', updateProfile)

export default router
