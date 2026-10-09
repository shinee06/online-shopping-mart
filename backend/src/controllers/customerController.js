import db from '../config/db.js'

export const getProfile = async (req, res, next) => {
  try {
    const [customers] = await db.execute(
      `SELECT id, full_name, email, phone, address
       FROM customers WHERE id = ? LIMIT 1`,
      [req.customerId]
    )

    if (!customers[0]) {
      return res.status(404).json({ message: 'Customer account not found' })
    }

    return res.json({
      data: {
        id: customers[0].id,
        fullName: customers[0].full_name,
        email: customers[0].email,
        phone: customers[0].phone || '',
        address: customers[0].address || ''
      }
    })
  } catch (error) {
    return next(error)
  }
}

export const updateProfile = async (req, res, next) => {
  const { fullName, phone, address } = req.body

  if (
    typeof fullName !== 'string' ||
    typeof phone !== 'string' ||
    typeof address !== 'string' ||
    !fullName.trim()
  ) {
    return res.status(400).json({
      message: 'Name, phone number, and address must be valid text values'
    })
  }

  try {
    await db.execute(
      `UPDATE customers SET full_name = ?, phone = ?, address = ?
       WHERE id = ?`,
      [fullName.trim(), phone.trim(), address.trim(), req.customerId]
    )

    const [customers] = await db.execute(
      'SELECT id FROM customers WHERE id = ? LIMIT 1',
      [req.customerId]
    )
    if (!customers[0]) {
      return res.status(404).json({ message: 'Customer account not found' })
    }

    return res.json({
      message: 'Profile updated successfully',
      data: {
        id: req.customerId,
        fullName: fullName.trim(),
        phone: phone.trim(),
        address: address.trim()
      }
    })
  } catch (error) {
    return next(error)
  }
}
