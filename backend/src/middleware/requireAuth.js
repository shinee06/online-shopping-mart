import { verifyAuthToken } from '../utils/authToken.js'

const requireAuth = (req, res, next) => {
  const authorization = req.get('authorization') || ''
  const [scheme, token] = authorization.split(' ')

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Please log in to continue' })
  }

  try {
    const claims = verifyAuthToken(token)

    if (!claims) {
      return res.status(401).json({ message: 'Your session is invalid or expired' })
    }

    req.customerId = claims.sub
    req.role = claims.role === 'admin' ? 'admin' : 'customer'
    next()
  } catch (error) {
    next(error)
  }
}

export default requireAuth
