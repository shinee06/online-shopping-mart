import { Router } from 'express'
import {
  getProduct,
  getProductReviews,
  listProducts
} from '../controllers/productController.js'

const router = Router()

router.get('/', listProducts)
router.get('/:productId/reviews', getProductReviews)
router.get('/:id', getProduct)

export default router
