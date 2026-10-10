import {
  createProduct as createProductInService,
  deleteProduct as deleteProductInService,
  updateProduct as updateProductInService
} from '../../services/productService.js'

const parseProduct = ({ name, price, description, category = '', image = '', stock = 0 }) => {
  const parsedPrice = Number(price)
  const parsedStock = Number(stock)

  if (
    typeof name !== 'string' ||
    !name.trim() ||
    name.trim().length > 255 ||
    price === undefined ||
    price === null ||
    price === '' ||
    !Number.isFinite(parsedPrice) ||
    parsedPrice < 0 ||
    typeof description !== 'string' ||
    typeof category !== 'string' ||
    category.trim().length > 100 ||
    typeof image !== 'string' ||
    image.length > 2048 ||
    !Number.isInteger(parsedStock) ||
    parsedStock < 0
  ) {
    return null
  }

  return {
    name: name.trim(),
    price: parsedPrice,
    description: description.trim(),
    category: category.trim(),
    image: image.trim(),
    stock: parsedStock
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
    const createdProduct = await createProductInService(product)

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
    const result = await updateProductInService(id, product)
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
    const deleted = await deleteProductInService(id)
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
