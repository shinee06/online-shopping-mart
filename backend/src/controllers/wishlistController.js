import {
  addWishlistItem,
  listWishlistByCustomer,
  removeWishlistItem
} from '../dao/wishlistDAO.js'

export const getWishlist = async (req, res, next) => {
  try {
    const products = await listWishlistByCustomer(req.customerId)

    return res.json({ data: products })
  } catch (error) {
    return next(error)
  }
}

export const addToWishlist = async (req, res, next) => {
  const productId = Number(req.body.productId)

  if (!Number.isInteger(productId) || productId < 1) {
    return res.status(400).json({ message: 'Provide a valid product ID' })
  }

  try {
    const added = await addWishlistItem(req.customerId, productId)
    if (!added) {
      return res.status(404).json({ message: 'Product not found' })
    }

    return res.status(201).json({
      message: 'Product saved to your wishlist',
      data: { productId }
    })
  } catch (error) {
    return next(error)
  }
}

export const removeFromWishlist = async (req, res, next) => {
  const productId = Number(req.params.productId)

  if (!Number.isInteger(productId) || productId < 1) {
    return res.status(400).json({ message: 'Product ID must be a positive integer' })
  }

  try {
    const removed = await removeWishlistItem(req.customerId, productId)
    if (!removed) {
      return res.status(404).json({ message: 'Product is not in your wishlist' })
    }

    return res.json({ message: 'Product removed from your wishlist' })
  } catch (error) {
    return next(error)
  }
}
