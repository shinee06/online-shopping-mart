import { Router } from 'express'
import {
  createProduct,
  deleteProduct,
  updateProduct
} from '../controllers/adminProductController.js'
import requireAdmin from '../middleware/requireAdmin.js'

const router = Router()

router.use(requireAdmin)
router.post('/', createProduct)
router.put('/:id', updateProduct)
router.delete('/:id', deleteProduct)

export default router
