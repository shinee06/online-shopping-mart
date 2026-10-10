import OrderDAO from '../dao/OrderDAO.jsx'
import CartDAO from '../dao/CartDAO.jsx'

const CheckoutServlet = {
  async placeOrder(customer, items = CartDAO.getAll()) {
    if (!customer || typeof customer !== 'object') {
      throw new TypeError('Shipping details are required')
    }
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('Your cart is empty')
    }

    const order = await OrderDAO.create({ customer, items })
    CartDAO.clear()
    return order
  }
}

export default CheckoutServlet
