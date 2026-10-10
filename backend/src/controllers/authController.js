import { authenticateCustomer, registerCustomer } from '../../services/authService.js'

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
    const authentication = await registerCustomer({ fullName, email, phone, password })

    return res.status(201).json({
      message: 'Account created successfully',
      data: {
        ...authentication
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
    const authentication = await authenticateCustomer({ email, password })
    if (!authentication) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    return res.json({
      message: 'Logged in successfully',
      data: {
        ...authentication
      }
    })
  } catch (error) {
    return next(error)
  }
}
