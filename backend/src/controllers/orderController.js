import {
  getOrdersForCustomer,
  requestOrderOtp,
  verifyOrderOtp
} from '../../services/orderService.js'

const validateOrder = ({ items, customer }) => {
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
    return { error: 'Provide items and complete shipping details' }
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
      return { error: 'Each order item needs a valid product and quantity' }
    }

    quantities.set(productId, (quantities.get(productId) || 0) + quantity)
  }

  if ([...quantities.values()].some((quantity) => quantity > 99)) {
    return { error: 'Maximum quantity per product is 99' }
  }

  return { customer, quantities }
}

export const requestOtp = async (req, res, next) => {
  const validated = validateOrder(req.body)
  if (validated.error) return res.status(400).json({ message: validated.error })

  try {
    await requestOrderOtp(req.customerId, validated.customer, validated.quantities)
    return res.json({ message: `A verification code was sent to ${validated.customer.email.trim()}` })
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ message: error.message })
    return next(error)
  }
}

export const verifyOtp = async (req, res, next) => {
  if (typeof req.body.code !== 'string' || !/^\d{6}$/.test(req.body.code)) {
    return res.status(400).json({ message: 'Enter the 6-digit verification code' })
  }

  try {
    const order = await verifyOrderOtp(req.customerId, req.body.code)
    return res.status(201).json({
      message: 'Order placed successfully',
      data: order
    })
  } catch (error) {
    if (error.statusCode) {
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
