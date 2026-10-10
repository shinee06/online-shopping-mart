import {
  getOrdersForCustomer,
  placeOrder as placeOrderInService
} from '../../services/orderService.js'

export const placeOrder = async (req, res, next) => {
  const { items, customer } = req.body

  if (
    !Array.isArray(items) ||
    items.length === 0 ||
    !customer ||
    typeof customer.fullName !== 'string' ||
    typeof customer.email !== 'string' ||
    typeof customer.address !== 'string' ||
    typeof customer.city !== 'string' ||
    typeof customer.zipCode !== 'string' ||
    typeof customer.phone !== 'string' ||
    !customer.fullName.trim() ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email) ||
    !customer.address.trim() ||
    !customer.city.trim() ||
    !customer.zipCode.trim() ||
    !customer.phone.trim()
  ) {
    return res.status(400).json({ message: 'Provide items and complete shipping details' })
  }

  const quantities = new Map()
  for (const item of items) {
    const productId = Number(item.productId)
    const quantity = Number(item.quantity)

    if (
      !Number.isInteger(productId) ||
      productId < 1 ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > 99
    ) {
      return res.status(400).json({ message: 'Each order item needs a valid product and quantity' })
    }

    quantities.set(productId, (quantities.get(productId) || 0) + quantity)
  }

  if ([...quantities.values()].some((quantity) => quantity > 99)) {
    return res.status(400).json({ message: 'Maximum quantity per product is 99' })
  }

  try {
    const order = await placeOrderInService(req.customerId, customer, quantities)
    return res.status(201).json({
      message: 'Order placed successfully',
      data: order
    })
  } catch (error) {
    if (error.statusCode === 400) {
      return res.status(error.statusCode).json({ message: error.message })
    }
    return next(error)
  }
}

export const getOrders = async (req, res, next) => {
  try {
    const orders = await getOrdersForCustomer(req.customerId)
    return res.json({ data: orders })
  } catch (error) {
    return next(error)
  }
}
