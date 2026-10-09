import {
  createProduct as createProductInDAO,
  deleteProduct as deleteProductInDAO,
  updateProduct as updateProductInDAO
} from '../dao/productDAO.js'

const parseProduct = ({ name, price, description }) => {
  const parsedPrice = Number(price)

  if (
    typeof name !== 'string' ||
    !name.trim() ||
    name.trim().length > 255 ||
    price === undefined ||
    price === null ||
    price === '' ||
    !Number.isFinite(parsedPrice) ||
    parsedPrice < 0 ||
    typeof description !== 'string'
  ) {
    return null
  }

  return {
    name: name.trim(),
    price: parsedPrice,
    description: description.trim()
  }
}

const parseId = (rawId) => {
  const id = Number(rawId)
  return Number.isInteger(id) && id > 0 ? id : null
}

export const createProduct = async (req, res, next) => {
  const product = parseProduct(req.body)

  if (!product) {
    return res.status(400).json({ message: 'Enter a product name, valid price, and description' })
  }

  try {
    const createdProduct = await createProductInDAO(product)

    return res.status(201).json({
      message: 'Product added successfully',
      data: createdProduct,
      status: 201
    })
  } catch (error) {
    return next(error)
  }
}

export const updateProduct = async (req, res, next) => {
  const id = parseId(req.params.id)
  const product = parseProduct(req.body)

  if (!id) {
    return res.status(400).json({ message: 'Product ID must be a positive integer' })
  }

  if (!product) {
    return res.status(400).json({ message: 'Enter a product name, valid price, and description' })
  }

  try {
    const result = await updateProductInDAO(id, product)
    if (!result.product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    return res.json({
      message: 'Product updated successfully',
      data: result.product,
      status: 200
    })
  } catch (error) {
    return next(error)
  }
}

export const deleteProduct = async (req, res, next) => {
  const id = parseId(req.params.id)

  if (!id) {
    return res.status(400).json({ message: 'Product ID must be a positive integer' })
  }

  try {
    const deleted = await deleteProductInDAO(id)
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' })
    }

    return res.json({
      message: 'Product deleted successfully',
      status: 200
    })
  } catch (error) {
    return next(error)
  }
}
