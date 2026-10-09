import { Router } from 'express'
import {
  createReview,
  deleteReview,
  updateReview
} from '../controllers/reviewController.js'
import requireAuth from '../middleware/requireAuth.js'

const router = Router()

router.use(requireAuth)
router.post('/', createReview)
router.put('/:reviewId', updateReview)
router.delete('/:reviewId', deleteReview)

export default router
