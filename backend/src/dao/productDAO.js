import db from '../config/db.js'

export const listProducts = async () => {
  const [products] = await db.execute(
    'SELECT id, name, price, description FROM products ORDER BY id DESC'
  )
  return products
}

export const findProductById = async (id) => {
  const [products] = await db.execute(
    'SELECT id, name, price, description FROM products WHERE id = ? LIMIT 1',
    [id]
  )
  return products[0] || null
}

export const findProductsByIds = async (connection, ids) => {
  if (ids.length === 0) {
    return []
  }

  const placeholders = ids.map(() => '?').join(', ')
  const [products] = await connection.execute(
    `SELECT id, name, price FROM products WHERE id IN (${placeholders})`,
    ids
  )
  return products
}

export const createProduct = async ({ name, price, description }) => {
  const [result] = await db.execute(
    'INSERT INTO products (name, price, description) VALUES (?, ?, ?)',
    [name, price, description]
  )
  return { id: result.insertId, name, price, description }
}

export const updateProduct = async (id, { name, price, description }) => {
  const [result] = await db.execute(
    `UPDATE products SET name = ?, price = ?, description = ?
     WHERE id = ?`,
    [name, price, description, id]
  )

  return {
    updated: result.affectedRows > 0,
    product: result.affectedRows > 0
      ? { id, name, price, description }
      : await findProductById(id)
  }
}

export const deleteProduct = async (id) => {
  const [result] = await db.execute(
    'DELETE FROM products WHERE id = ?',
    [id]
  )
  return result.affectedRows > 0
}
