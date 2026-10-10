import { Router } from 'express'
import {
  getOrders,
  requestOtp,
  verifyOtp
} from '../controllers/orderController.js'
import requireAuth from '../middleware/requireAuth.js'

const router = Router()

router.use(requireAuth)
router.get('/', getOrders)
router.post('/otp/request', requestOtp)
router.post('/otp/verify', verifyOtp)

export default router
