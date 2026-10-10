import OrderDAO from '../dao/OrderDAO.jsx'
import ProductDAO from '../dao/ProductDAO.jsx'

const AdminServlet = {
  async getDashboardData() {
    const [products, orders] = await Promise.all([
      ProductDAO.getAll(),
      OrderDAO.getAll()
    ])
    return {
      products,
      orders,
      productCount: products.length,
      orderCount: orders.length,
      revenue: orders.reduce((sum, order) => sum + Number(order.total || 0), 0)
    }
  },

  getProducts() {
    return ProductDAO.getAll()
  },

  createProduct(product) {
    return ProductDAO.create(product)
  },

  updateProduct(productId, product) {
    return ProductDAO.update(productId, product)
  },

  deleteProduct(productId) {
    return ProductDAO.remove(productId)
  },

  getOrders() {
    return OrderDAO.getAll()
  }
}

export default AdminServlet
