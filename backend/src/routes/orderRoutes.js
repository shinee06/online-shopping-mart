import { Router } from 'express'
import {
  getOrders,
  placeOrder
} from '../controllers/orderController.js'
import requireAuth from '../middleware/requireAuth.js'

const router = Router()

router.use(requireAuth)
router.get('/', getOrders)
router.post('/', placeOrder)

export default router
