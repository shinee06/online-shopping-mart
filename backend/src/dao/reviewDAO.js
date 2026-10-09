import db from '../config/db.js'

export const listReviewsForProduct = async (productId) => {
  const [reviews] = await db.execute(
    `SELECT r.id, r.product_id, r.customer_id, c.full_name AS customer_name,
            r.rating, r.review_text, r.created_at, r.updated_at
     FROM reviews r
     INNER JOIN customers c ON c.id = r.customer_id
     WHERE r.product_id = ?
     ORDER BY r.created_at DESC, r.id DESC`,
    [productId]
  )
  return reviews
}

export const findProductForReview = async (productId) => {
  const [products] = await db.execute(
    'SELECT id FROM products WHERE id = ? LIMIT 1',
    [productId]
  )
  return products[0] || null
}

export const createReview = async (
  customerId,
  { productId, rating, reviewText }
) => {
  const [result] = await db.execute(
    `INSERT INTO reviews (product_id, customer_id, rating, review_text)
     VALUES (?, ?, ?, ?)`,
    [productId, customerId, rating, reviewText]
  )

  return findReviewById(result.insertId)
}

export const findReviewById = async (reviewId) => {
  const [reviews] = await db.execute(
    `SELECT r.id, r.product_id, r.customer_id, c.full_name AS customer_name,
            r.rating, r.review_text, r.created_at, r.updated_at
     FROM reviews r
     INNER JOIN customers c ON c.id = r.customer_id
     WHERE r.id = ? LIMIT 1`,
    [reviewId]
  )
  return reviews[0] || null
}

export const updateReview = async (
  reviewId,
  customerId,
  { rating, reviewText }
) => {
  const [result] = await db.execute(
    `UPDATE reviews SET rating = ?, review_text = ?
     WHERE id = ? AND customer_id = ?`,
    [rating, reviewText, reviewId, customerId]
  )

  return result.affectedRows > 0
    ? findReviewById(reviewId)
    : null
}

export const deleteReview = async (reviewId, customerId) => {
  const [result] = await db.execute(
    'DELETE FROM reviews WHERE id = ? AND customer_id = ?',
    [reviewId, customerId]
  )
  return result.affectedRows > 0
}
