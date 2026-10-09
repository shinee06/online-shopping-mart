import db from '../config/db.js'

const shippingFee = 200

export const placeOrder = async (req, res, next) => {
  const { items, customer } = req.body

  if (
    !Array.isArray(items) ||
    items.length === 0 ||
    !customer ||
    typeof customer.fullName !== 'string' ||
    typeof customer.email !== 'string' ||
    typeof customer.address !== 'string' ||
    typeof customer.city !== 'string' ||
    typeof customer.zipCode !== 'string' ||
    typeof customer.phone !== 'string' ||
    !customer.fullName.trim() ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email) ||
    !customer.address.trim() ||
    !customer.city.trim() ||
    !customer.zipCode.trim() ||
    !customer.phone.trim()
  ) {
    return res.status(400).json({ message: 'Provide items and complete shipping details' })
  }

  const quantities = new Map()
  for (const item of items) {
    const productId = Number(item.productId)
    const quantity = Number(item.quantity)

    if (
      !Number.isInteger(productId) ||
      productId < 1 ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > 99
    ) {
      return res.status(400).json({ message: 'Each order item needs a valid product and quantity' })
    }

    quantities.set(productId, (quantities.get(productId) || 0) + quantity)
  }

  if ([...quantities.values()].some((quantity) => quantity > 99)) {
    return res.status(400).json({ message: 'Maximum quantity per product is 99' })
  }

  let connection
  try {
    connection = await db.getConnection()
    await connection.beginTransaction()

    const productIds = [...quantities.keys()]
    const placeholders = productIds.map(() => '?').join(', ')
    const [products] = await connection.execute(
      `SELECT id, name, price FROM products WHERE id IN (${placeholders})`,
      productIds
    )

    if (products.length !== productIds.length) {
      await connection.rollback()
      return res.status(400).json({ message: 'One or more selected products no longer exist' })
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
        req.customerId,
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
        `INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity)
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
    return res.status(201).json({
      message: 'Order placed successfully',
      data: {
        id: orderResult.insertId,
        subtotal,
        shipping: shippingFee,
        total
      }
    })
  } catch (error) {
    if (connection) {
      await connection.rollback()
    }
    return next(error)
  } finally {
    if (connection) {
      connection.release()
    }
  }
}

export const getOrders = async (req, res, next) => {
  try {
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
      [req.customerId]
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

    return res.json({ data: [...orderMap.values()] })
  } catch (error) {
    return next(error)
  }
}
