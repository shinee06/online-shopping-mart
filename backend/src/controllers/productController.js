import db from '../config/db.js'

export const listProducts = async (req, res, next) => {
  try {
    const [products] = await db.execute(
      'SELECT id, name, price, description FROM products ORDER BY id DESC'
    )

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
    const [products] = await db.execute(
      'SELECT id, name, price, description FROM products WHERE id = ? LIMIT 1',
      [id]
    )

    if (!products[0]) {
      return res.status(404).json({ message: 'Product not found' })
    }

    return res.json({
      message: 'Product fetched successfully',
      data: products[0],
      status: 200
    })
  } catch (error) {
    return next(error)
  }
}
