import CartDAO from '../dao/CartDAO.jsx'

const CartServlet = {
  getItems() {
    return CartDAO.getAll()
  },

  getItemCount() {
    return CartDAO.getItemCount()
  },

  addItem(product, quantity = 1) {
    return CartDAO.add(product, quantity)
  },

  removeItem(productId) {
    return CartDAO.remove(productId)
  },

  clear() {
    return CartDAO.clear()
  }
}

export default CartServlet
