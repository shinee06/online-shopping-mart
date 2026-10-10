import db from '../src/config/db.js'

export const hasAdminAccount = async () => {
  const [rows] = await db.execute(
    "SELECT id FROM customers WHERE role = 'admin' LIMIT 1"
  )
  return rows.length > 0
}

export const getAdminOverview = async () => {
  const [[productStats], [customerStats], [orderStats]] = await Promise.all([
    db.execute('SELECT COUNT(*) AS productCount FROM products'),
    db.execute('SELECT COUNT(*) AS customerCount FROM customers'),
    db.execute('SELECT COUNT(*) AS orderCount, COALESCE(SUM(total), 0) AS revenue FROM orders')
  ])

  return {
    productCount: Number(productStats[0].productCount),
    customerCount: Number(customerStats[0].customerCount),
    orderCount: Number(orderStats[0].orderCount),
    revenue: Number(orderStats[0].revenue)
  }
}

export const listCustomersForAdmin = async () => {
  const [rows] = await db.execute(
    `SELECT id, full_name, email, phone, address, role, created_at
     FROM customers
     ORDER BY created_at DESC, id DESC`
  )

  return rows.map((customer) => ({
    id: customer.id,
    fullName: customer.full_name,
    email: customer.email,
    phone: customer.phone || '',
    address: customer.address || '',
    role: customer.role,
    createdAt: customer.created_at
  }))
}

export const listAllOrdersForAdmin = async () => {
  const [rows] = await db.execute(
    `SELECT
       o.id, o.customer_id, o.customer_name, o.customer_email, o.customer_phone,
       o.address, o.city, o.zip_code, o.subtotal, o.shipping, o.total,
       o.created_at, oi.product_id, oi.product_name, oi.unit_price, oi.quantity
     FROM orders o
     LEFT JOIN order_items oi ON oi.order_id = o.id
     ORDER BY o.created_at DESC, o.id DESC`
  )
  const orders = new Map()

  for (const row of rows) {
    if (!orders.has(row.id)) {
      orders.set(row.id, {
        id: row.id,
        customer: {
          id: row.customer_id,
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
      orders.get(row.id).items.push({
        id: row.product_id,
        name: row.product_name,
        price: Number(row.unit_price),
        quantity: row.quantity
      })
    }
  }

  return [...orders.values()]
}
