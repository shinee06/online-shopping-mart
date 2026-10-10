import requireAuth from './requireAuth.js'

const requireAdmin = (req, res, next) => {
  requireAuth(req, res, (error) => {
    if (error) return next(error)
    if (res.headersSent) return undefined
    if (req.role !== 'admin') {
      return res.status(403).json({ message: 'Administrator access is required' })
    }
    return next()
  })
}

export default requireAdmin
