import { createCustomer, findCustomerByEmail } from '../src/dao/customerDAO.js'
import { createAuthToken } from '../src/utils/authToken.js'
import { hashPassword, verifyPassword } from '../utils/passwordUtil.js'

const toPublicCustomer = (customer) => ({
  id: customer.id,
  fullName: customer.full_name,
  email: customer.email,
  phone: customer.phone || '',
  address: customer.address || '',
  role: customer.role || 'customer'
})

export const registerCustomer = async ({ fullName, email, phone, password }) => {
  const normalizedEmail = email.trim().toLowerCase()
  const passwordHash = await hashPassword(password)
  const customer = await createCustomer({
    fullName: fullName.trim(),
    email: normalizedEmail,
    phone: phone.trim(),
    passwordHash
  })

  return {
    customer: toPublicCustomer(customer),
    token: createAuthToken(customer)
  }
}

export const createAdminAccount = async ({ fullName, email, phone, password }) => {
  const normalizedEmail = email.trim().toLowerCase()
  const passwordHash = await hashPassword(password)
  const customer = await createCustomer({
    fullName: fullName.trim(),
    email: normalizedEmail,
    phone: phone.trim(),
    passwordHash,
    role: 'admin'
  })

  return {
    customer: toPublicCustomer(customer),
    token: createAuthToken(customer)
  }
}

export const authenticateCustomer = async ({ email, password }) => {
  const customer = await findCustomerByEmail(email.trim().toLowerCase())
  if (!customer || !(await verifyPassword(password, customer.password_hash))) {
    return null
  }

  return {
    customer: toPublicCustomer(customer),
    token: createAuthToken(customer)
  }
}

export { toPublicCustomer }
