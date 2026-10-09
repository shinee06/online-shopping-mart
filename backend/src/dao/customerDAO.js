import db from '../config/db.js'

const profileColumns = `id, full_name, email, phone, address`

export const createCustomer = async ({
  fullName,
  email,
  phone,
  passwordHash
}) => {
  const [result] = await db.execute(
    `INSERT INTO customers (full_name, email, phone, address, password_hash)
     VALUES (?, ?, ?, '', ?)`,
    [fullName, email, phone, passwordHash]
  )

  return {
    id: result.insertId,
    full_name: fullName,
    email,
    phone,
    address: ''
  }
}

export const findCustomerByEmail = async (email) => {
  const [customers] = await db.execute(
    `SELECT ${profileColumns}, password_hash
     FROM customers WHERE email = ? LIMIT 1`,
    [email]
  )

  return customers[0] || null
}

export const findCustomerById = async (customerId) => {
  const [customers] = await db.execute(
    `SELECT ${profileColumns}
     FROM customers WHERE id = ? LIMIT 1`,
    [customerId]
  )

  return customers[0] || null
}

export const updateCustomerProfile = async (
  customerId,
  { fullName, phone, address }
) => {
  await db.execute(
    `UPDATE customers
     SET full_name = ?, phone = ?, address = ?
     WHERE id = ?`,
    [fullName, phone, address, customerId]
  )

  return findCustomerById(customerId)
}
