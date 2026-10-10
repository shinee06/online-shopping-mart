import UserDAO from '../dao/UserDAO.jsx'

const getToken = () => localStorage.getItem('authToken')
const isAuthenticated = () => Boolean(getToken())

const SessionServlet = {
  getCurrentUser() {
    return UserDAO.getCurrentUser()
  },

  getToken,

  isAuthenticated,

  requireAuthentication() {
    if (!isAuthenticated()) {
      throw new Error('You must be signed in to continue')
    }
    return this.getCurrentUser()
  },

  end() {
    UserDAO.logout()
  }
}

export default SessionServlet
