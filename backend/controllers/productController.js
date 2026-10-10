// Compatibility exports for code that imports controllers from this directory.
export { getProduct, getProductReviews, listProducts } from '../src/controllers/productController.js'
export {
  createProduct,
  deleteProduct,
  updateProduct
} from '../src/controllers/adminProductController.js'
