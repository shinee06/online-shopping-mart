const sendServiceUnavailable = (res) => res.status(503).json({
  message: 'Cart storage is not configured on the server. The current app stores carts in browser storage.'
})

// Supply a cart service with get(customerId), add(customerId, item),
// update(customerId, productId, quantity), remove(customerId, productId),
// and clear(customerId) methods to connect persistent cart storage.
const createCartController = (cartService) => {
  if (!cartService) {
    return {
      getCart: (req, res) => sendServiceUnavailable(res),
      addToCart: (req, res) => sendServiceUnavailable(res),
      updateCartItem: (req, res) => sendServiceUnavailable(res),
      removeCartItem: (req, res) => sendServiceUnavailable(res),
      clearCart: (req, res) => sendServiceUnavailable(res)
    }
  }

  const requireCustomer = (req, res) => {
    if (Number.isInteger(Number(req.customerId)) && Number(req.customerId) > 0) {
      return Number(req.customerId)
    }
    res.status(401).json({ message: 'Authentication is required' })
    return null
  }

  const parseProductId = (value) => {
    const id = Number(value)
    return Number.isInteger(id) && id > 0 ? id : null
  }

  const parseQuantity = (value) => {
    const quantity = Number(value)
    return Number.isInteger(quantity) && quantity > 0 && quantity <= 99
      ? quantity
      : null
  }

  const run = (handler) => async (req, res, next) => {
    try {
      const result = await handler(req, res)
      if (result !== undefined && !res.headersSent) {
        return res.json({ data: result })
      }
    } catch (error) {
      return next(error)
    }
  }

  return {
    getCart: run(async (req, res) => {
      const customerId = requireCustomer(req, res)
      return customerId === null ? undefined : cartService.get(customerId)
    }),

    addToCart: run(async (req, res) => {
      const customerId = requireCustomer(req, res)
      if (customerId === null) return undefined
      const productId = parseProductId(req.body?.productId)
      const quantity = parseQuantity(req.body?.quantity ?? 1)
      if (productId === null || quantity === null) {
        res.status(400).json({ message: 'Provide a valid product ID and quantity from 1 to 99' })
        return undefined
      }
      return cartService.add(customerId, { productId, quantity })
    }),

    updateCartItem: run(async (req, res) => {
      const customerId = requireCustomer(req, res)
      if (customerId === null) return undefined
      const productId = parseProductId(req.params.productId)
      const quantity = parseQuantity(req.body?.quantity)
      if (productId === null || quantity === null) {
        res.status(400).json({ message: 'Provide a valid product ID and quantity from 1 to 99' })
        return undefined
      }
      return cartService.update(customerId, productId, quantity)
    }),

    removeCartItem: run(async (req, res) => {
      const customerId = requireCustomer(req, res)
      if (customerId === null) return undefined
      const productId = parseProductId(req.params.productId)
      if (productId === null) {
        res.status(400).json({ message: 'Product ID must be a positive integer' })
        return undefined
      }
      return cartService.remove(customerId, productId)
    }),

    clearCart: run(async (req, res) => {
      const customerId = requireCustomer(req, res)
      return customerId === null ? undefined : cartService.clear(customerId)
    })
  }
}

export default createCartController
