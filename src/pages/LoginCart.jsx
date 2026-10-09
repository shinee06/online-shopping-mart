import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiRequest, saveAuthentication } from '../services/api.js'

const LoginCart = () => {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLoginCart = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      })
      saveAuthentication(result.data)
      navigate('/customer-dashboard')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <h1>Online Shopping Mart</h1>

      <h2>Login</h2>

      <form onSubmit={handleLoginCart}>
        <label htmlFor="login-email">Email</label>

        <input
          id="login-email"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br />
        <br />

        <label htmlFor="login-password">Password</label>

        <input
          id="login-password"
          type="password"
          name="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br />
        <br />

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      {error && <p className="request-error" role="alert">{error}</p>}
      <p>
        Don&apos;t have an account? <Link to="/register">Create one</Link>
      </p>
    </div>
  )
}

export default LoginCart