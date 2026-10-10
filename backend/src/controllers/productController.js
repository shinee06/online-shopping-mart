import { getProductById, listProducts as listProductsFromService } from '../../services/productService.js'
import { listReviewsForProduct } from '../dao/reviewDAO.js'

export const listProducts = async (req, res, next) => {
  try {
    const products = await listProductsFromService()

    return res.json({
      message: 'Products fetched successfully',
      data: products,
      status: 200
    })
  } catch (error) {
    return next(error)
  }
}

export const getProduct = async (req, res, next) => {
  const id = Number(req.params.id)

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ message: 'Product ID must be a positive integer' })
  }

  try {
    const product = await getProductById(id)

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    return res.json({
      message: 'Product fetched successfully',
      data: product,
      status: 200
    })
  } catch (error) {
    return next(error)
  }
}

export const getProductReviews = async (req, res, next) => {
  const productId = Number(req.params.productId)

  if (!Number.isInteger(productId) || productId < 1) {
    return res.status(400).json({ message: 'Product ID must be a positive integer' })
  }

  try {
    const product = await getProductById(productId)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    const reviews = await listReviewsForProduct(productId)
    return res.json({
      message: 'Product reviews fetched successfully',
      data: reviews
    })
  } catch (error) {
    return next(error)
  }
}
