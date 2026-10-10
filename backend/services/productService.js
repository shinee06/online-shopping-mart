import {
  createProduct as createProductRecord,
  deleteProduct as deleteProductRecord,
  findProductById as findProductRecord,
  listProducts as listProductRecords,
  updateProduct as updateProductRecord
} from '../src/dao/productDAO.js'

export const listProducts = () => listProductRecords()
export const getProductById = (productId) => findProductRecord(productId)
export const createProduct = (product) => createProductRecord(product)
export const updateProduct = (productId, product) => updateProductRecord(productId, product)
export const deleteProduct = (productId) => deleteProductRecord(productId)
