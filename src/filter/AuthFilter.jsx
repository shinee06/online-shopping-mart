import { Navigate, Outlet, useLocation } from 'react-router-dom'

const readUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null')
  } catch {
    return null
  }
}

const AuthFilter = ({ children, requiredRoles = [], redirectTo = '/login' }) => {
  const location = useLocation()
  const token = localStorage.getItem('authToken')

  if (!token) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  if (requiredRoles.length > 0) {
    const user = readUser()
    const role = String(user?.role || user?.userType || '').toLowerCase()
    const roles = Array.isArray(user?.roles)
      ? user.roles.map((value) => String(value).toLowerCase())
      : [role]
    const allowed = requiredRoles.some((value) => roles.includes(String(value).toLowerCase()))

    if (!allowed) {
      return <Navigate to="/customer-dashboard" replace />
    }
  }

  return children ?? <Outlet />
}

export default AuthFilter
