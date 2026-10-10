import { Router } from 'express'
import createCartController from '../controllers/cartController.js'
import requireAuth from '../src/middleware/requireAuth.js'

const createCartRoutes = (cartService) => {
  const router = Router()
  const controller = createCartController(cartService)

  router.use(requireAuth)
  router.get('/', controller.getCart)
  router.post('/', controller.addToCart)
  router.patch('/:productId', controller.updateCartItem)
  router.delete('/:productId', controller.removeCartItem)
  router.delete('/', controller.clearCart)

  return router
}

export { createCartRoutes }
export default createCartRoutes()
