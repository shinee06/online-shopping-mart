import UserDAO from '../dao/UserDAO.jsx'

const RegisterServlet = {
  register(userData) {
    if (!userData || typeof userData !== 'object') {
      throw new TypeError('Registration details are required')
    }
    const fullName = String(userData.fullName || '').trim()
    const email = String(userData.email || '').trim().toLowerCase()
    const password = String(userData.password || '')

    if (!fullName || !email || password.length < 8) {
      throw new TypeError('Provide a name, valid email, and password with at least 8 characters')
    }

    return UserDAO.register({
      ...userData,
      fullName,
      email,
      password
    })
  }
}

export default RegisterServlet
