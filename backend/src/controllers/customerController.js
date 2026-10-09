import { findCustomerById, updateCustomerProfile } from '../dao/customerDAO.js'

export const getProfile = async (req, res, next) => {
  try {
    const customer = await findCustomerById(req.customerId)
    if (!customer) {
      return res.status(404).json({ message: 'Customer account not found' })
    }

    return res.json({
      data: {
        id: customer.id,
        fullName: customer.full_name,
        email: customer.email,
        phone: customer.phone || '',
        address: customer.address || ''
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
    const customer = await updateCustomerProfile(req.customerId, {
      fullName: fullName.trim(),
      phone: phone.trim(),
      address: address.trim()
    })
    if (!customer) {
      return res.status(404).json({ message: 'Customer account not found' })
    }

    return res.json({
      message: 'Profile updated successfully',
      data: {
        id: req.customerId,
        fullName: customer.full_name,
        phone: customer.phone || '',
        address: customer.address || ''
      }
    })
  } catch (error) {
    return next(error)
  }
}
