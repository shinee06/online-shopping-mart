import db from '../config/db.js'
import { findProductsByIds } from './productDAO.js'

const shippingFee = 200

export const createOrder = async (customerId, customer, quantities) => {
  const connection = await db.getConnection()
  let transactionStarted = false

  try {
    await connection.beginTransaction()
    transactionStarted = true

    const productIds = [...quantities.keys()]
    const products = await findProductsByIds(connection, productIds)

    if (products.length !== productIds.length) {
      const error = new Error('One or more selected products no longer exist')
      error.statusCode = 400
      throw error
    }

    const subtotal = products.reduce(
      (sum, product) => sum + Number(product.price) * quantities.get(product.id),
      0
    )
    const total = subtotal + shippingFee
    const [orderResult] = await connection.execute(
      `INSERT INTO orders
       (customer_id, customer_name, customer_email, customer_phone, address, city, zip_code, subtotal, shipping, total)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        customerId,
        customer.fullName.trim(),
        customer.email.trim().toLowerCase(),
        customer.phone.trim(),
        customer.address.trim(),
        customer.city.trim(),
        customer.zipCode.trim(),
        subtotal,
        shippingFee,
        total
      ]
    )

    for (const product of products) {
      await connection.execute(
        `INSERT INTO order_items
         (order_id, product_id, product_name, unit_price, quantity)
         VALUES (?, ?, ?, ?, ?)`,
        [
          orderResult.insertId,
          product.id,
          product.name,
          product.price,
          quantities.get(product.id)
        ]
      )
    }

    await connection.commit()
    transactionStarted = false

    return {
      id: orderResult.insertId,
      subtotal,
      shipping: shippingFee,
      total
    }
  } catch (error) {
    if (transactionStarted) {
      await connection.rollback()
    }
    throw error
  } finally {
    connection.release()
  }
}

export const listOrdersByCustomer = async (customerId) => {
  const [rows] = await db.execute(
    `SELECT
       o.id, o.customer_name, o.customer_email, o.customer_phone,
       o.address, o.city, o.zip_code, o.subtotal, o.shipping, o.total,
       o.created_at, oi.product_id, oi.product_name, oi.unit_price,
       oi.quantity
     FROM orders o
     LEFT JOIN order_items oi ON oi.order_id = o.id
     WHERE o.customer_id = ?
     ORDER BY o.created_at DESC, o.id DESC`,
    [customerId]
  )
  const orderMap = new Map()

  for (const row of rows) {
    if (!orderMap.has(row.id)) {
      orderMap.set(row.id, {
        id: row.id,
        customer: {
          fullName: row.customer_name,
          email: row.customer_email,
          phone: row.customer_phone,
          address: row.address,
          city: row.city,
          zipCode: row.zip_code
        },
        subtotal: Number(row.subtotal),
        shipping: Number(row.shipping),
        total: Number(row.total),
        createdAt: row.created_at,
        items: []
      })
    }

    if (row.product_name !== null) {
      orderMap.get(row.id).items.push({
        id: row.product_id,
        name: row.product_name,
        price: Number(row.unit_price),
        quantity: row.quantity
      })
    }
  }

  return [...orderMap.values()]
}
