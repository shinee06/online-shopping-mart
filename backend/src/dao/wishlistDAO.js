import db from '../config/db.js'

export const listWishlistByCustomer = async (customerId) => {
  const [products] = await db.execute(
    `SELECT p.id, p.name, p.price, p.description, w.created_at AS saved_at
     FROM wishlist_items w
     INNER JOIN products p ON p.id = w.product_id
     WHERE w.customer_id = ?
     ORDER BY w.created_at DESC`,
    [customerId]
  )
  return products
}

export const addWishlistItem = async (customerId, productId) => {
  const [products] = await db.execute(
    'SELECT id FROM products WHERE id = ? LIMIT 1',
    [productId]
  )

  if (!products[0]) {
    return false
  }

  await db.execute(
    `INSERT INTO wishlist_items (customer_id, product_id)
     VALUES (?, ?)
     ON DUPLICATE KEY UPDATE created_at = created_at`,
    [customerId, productId]
  )

  return true
}

export const removeWishlistItem = async (customerId, productId) => {
  const [result] = await db.execute(
    'DELETE FROM wishlist_items WHERE customer_id = ? AND product_id = ?',
    [customerId, productId]
  )
  return result.affectedRows > 0
}
