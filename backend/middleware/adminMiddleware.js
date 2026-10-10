// Compatibility import for the admin guard used by the active API routes.
import requireAdmin from '../src/middleware/requireAdmin.js'

export const adminMiddleware = requireAdmin
export default requireAdmin
