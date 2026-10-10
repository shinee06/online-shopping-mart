// Keep the legacy middleware path aligned with the authentication used by API routes.
import requireAuth from '../src/middleware/requireAuth.js'

export const authMiddleware = requireAuth
export default requireAuth
