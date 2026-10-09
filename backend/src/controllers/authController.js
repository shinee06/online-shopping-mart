import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'
import {
  createCustomer,
  findCustomerByEmail
} from '../dao/customerDAO.js'
import { createAuthToken } from '../utils/authToken.js'

const scrypt = promisify(scryptCallback)

const hashPassword = async (password) => {
  const salt = randomBytes(16)
  const hash = await scrypt(password, salt, 64)
  return `${salt.toString('hex')}:${Buffer.from(hash).toString('hex')}`
}

const verifyPassword = async (password, storedPassword) => {
  const [saltHex, hashHex] = storedPassword.split(':')

  if (!saltHex || !hashHex) {
    return false
  }

  const expected = Buffer.from(hashHex, 'hex')
  const actual = Buffer.from(await scrypt(
    password,
    Buffer.from(saltHex, 'hex'),
    expected.length
  ))

  return expected.length === actual.length && timingSafeEqual(expected, actual)
}

const publicCustomer = (customer) => ({
  id: customer.id,
  fullName: customer.full_name,
  email: customer.email,
  phone: customer.phone || '',
  address: customer.address || ''
})

export const register = async (req, res, next) => {
  const { fullName, email, phone, password } = req.body

  if (
    typeof fullName !== 'string' ||
    typeof email !== 'string' ||
    typeof phone !== 'string' ||
    typeof password !== 'string' ||
    !fullName.trim() ||
    fullName.trim().length > 150 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    email.trim().length > 254 ||
    phone.trim().length > 40 ||
    password.length < 8 ||
    password.length > 128
  ) {
    return res.status(400).json({
      message: 'Enter a name, valid email, phone number, and password of at least 8 characters'
    })
  }

  try {
    const normalizedEmail = email.trim().toLowerCase()
    const passwordHash = await hashPassword(password)
    const customer = await createCustomer({
      fullName: fullName.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      passwordHash
    })

    return res.status(201).json({
      message: 'Account created successfully',
      data: {
        customer: publicCustomer(customer),
        token: createAuthToken(customer)
      }
    })
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'An account with this email already exists' })
    }

    return next(error)
  }
}

export const login = async (req, res, next) => {
  const { email, password } = req.body

  if (
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    !email.trim() ||
    !password
  ) {
    return res.status(400).json({ message: 'Enter your email and password' })
  }

  try {
    const customer = await findCustomerByEmail(email.trim().toLowerCase())

    if (!customer || !(await verifyPassword(password, customer.password_hash))) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    return res.json({
      message: 'Logged in successfully',
      data: {
        customer: publicCustomer(customer),
        token: createAuthToken(customer)
      }
    })
  } catch (error) {
    return next(error)
  }
}
