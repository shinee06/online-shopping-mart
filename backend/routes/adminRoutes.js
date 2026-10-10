import { Router } from 'express'
import adminProductRoutes from '../src/routes/adminProductRoutes.js'
import requireAdmin from '../middleware/adminMiddleware.js'
import {
  getCustomers,
  getDashboardOverview,
  getOrders,
  registerAdmin
} from '../src/controllers/adminController.js'

const router = Router()

// Bootstrap registration is protected by ADMIN_SETUP_KEY; management APIs require an admin token.
router.post('/setup', registerAdmin)
router.use(requireAdmin)
router.get('/dashboard', getDashboardOverview)
router.get('/customers', getCustomers)
router.get('/orders', getOrders)

// Product mutation routes also apply requireAdmin when mounted independently.
router.use('/products', adminProductRoutes)

export default router
