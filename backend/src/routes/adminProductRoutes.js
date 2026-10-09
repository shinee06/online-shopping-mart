import { Router } from 'express'
import {
  createProduct,
  deleteProduct,
  updateProduct
} from '../controllers/adminProductController.js'

const router = Router()

router.post('/', createProduct)
router.put('/:id', updateProduct)
router.delete('/:id', deleteProduct)

export default router
