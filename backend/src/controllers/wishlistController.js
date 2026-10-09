import db from '../config/db.js'

export const getWishlist = async (req, res, next) => {
  try {
    const [products] = await db.execute(
      `SELECT p.id, p.name, p.price, p.description, w.created_at AS saved_at
       FROM wishlist_items w
       INNER JOIN products p ON p.id = w.product_id
       WHERE w.customer_id = ?
       ORDER BY w.created_at DESC`,
      [req.customerId]
    )

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
    const [products] = await db.execute(
      'SELECT id FROM products WHERE id = ? LIMIT 1',
      [productId]
    )

    if (!products[0]) {
      return res.status(404).json({ message: 'Product not found' })
    }

    await db.execute(
      `INSERT INTO wishlist_items (customer_id, product_id)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE created_at = created_at`,
      [req.customerId, productId]
    )

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
    const [result] = await db.execute(
      'DELETE FROM wishlist_items WHERE customer_id = ? AND product_id = ?',
      [req.customerId, productId]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product is not in your wishlist' })
    }

    return res.json({ message: 'Product removed from your wishlist' })
  } catch (error) {
    return next(error)
  }
}
