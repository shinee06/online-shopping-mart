import UserDAO from '../dao/UserDAO.jsx'

const LoginServlet = {
  login(credentials) {
    if (!credentials?.email || !credentials?.password) {
      throw new TypeError('Email and password are required')
    }
    return UserDAO.login({
      email: String(credentials.email).trim().toLowerCase(),
      password: credentials.password
    })
  },

  logout() {
    UserDAO.logout()
  }
}

export default LoginServlet
