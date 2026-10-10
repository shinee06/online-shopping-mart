import { timingSafeEqual } from 'node:crypto'
import { createAdminAccount } from '../../services/authService.js'
import {
  getAdminOverview,
  hasAdminAccount,
  listAllOrdersForAdmin,
  listCustomersForAdmin
} from '../../services/adminService.js'

const hasValidSetupKey = (providedKey) => {
  const configuredKey = process.env.ADMIN_SETUP_KEY
  if (
    typeof configuredKey !== 'string' ||
    configuredKey.length < 32 ||
    typeof providedKey !== 'string'
  ) return false

  const configured = Buffer.from(configuredKey)
  const provided = Buffer.from(providedKey)
  return configured.length === provided.length && timingSafeEqual(configured, provided)
}

export const registerAdmin = async (req, res, next) => {
  const { setupKey, fullName, email, phone, password } = req.body || {}
  if (!hasValidSetupKey(setupKey)) {
    return res.status(process.env.ADMIN_SETUP_KEY ? 403 : 503).json({
      message: process.env.ADMIN_SETUP_KEY
        ? 'The admin setup key is invalid.'
        : 'Admin registration is not configured on the server.'
    })
  }

  if (
    typeof fullName !== 'string' || !fullName.trim() || fullName.trim().length > 150 ||
    typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.trim().length > 254 ||
    typeof phone !== 'string' || phone.trim().length > 40 ||
    typeof password !== 'string' || password.length < 8 || password.length > 128
  ) {
    return res.status(400).json({
      message: 'Enter a name, valid email, phone number, and password between 8 and 128 characters.'
    })
  }

  try {
    if (await hasAdminAccount()) {
      return res.status(409).json({ message: 'An admin account has already been set up.' })
    }
    const authentication = await createAdminAccount({ fullName, email, phone, password })
    return res.status(201).json({
      message: 'Admin account created successfully.',
      data: authentication
    })
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'An account with this email already exists.' })
    }
    return next(error)
  }
}

export const getDashboardOverview = async (req, res, next) => {
  try {
    const overview = await getAdminOverview()
    return res.json({ data: overview })
  } catch (error) {
    return next(error)
  }
}

export const getCustomers = async (req, res, next) => {
  try {
    const customers = await listCustomersForAdmin()
    return res.json({ data: customers })
  } catch (error) {
    return next(error)
  }
}

export const getOrders = async (req, res, next) => {
  try {
    const orders = await listAllOrdersForAdmin()
    return res.json({ data: orders })
  } catch (error) {
    return next(error)
  }
}
