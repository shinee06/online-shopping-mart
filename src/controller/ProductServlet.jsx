import ProductDAO from '../dao/ProductDAO.jsx'

const ProductServlet = {
  getAll() {
    return ProductDAO.getAll()
  },

  getById(productId) {
    return ProductDAO.getById(productId)
  },

  create(product) {
    return ProductDAO.create(product)
  },

  update(productId, product) {
    return ProductDAO.update(productId, product)
  },

  remove(productId) {
    return ProductDAO.remove(productId)
  }
}

export default ProductServlet
