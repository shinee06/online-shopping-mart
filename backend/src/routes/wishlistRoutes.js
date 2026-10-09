import { Router } from 'express'
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist
} from '../controllers/wishlistController.js'
import requireAuth from '../middleware/requireAuth.js'

const router = Router()

router.use(requireAuth)
router.get('/', getWishlist)
router.post('/', addToWishlist)
router.delete('/:productId', removeFromWishlist)

export default router
