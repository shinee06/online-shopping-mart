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
    <main className="auth-page auth-login-page">
      <section className="login-shell" aria-label="ShineeMart sign in">
        <aside className="login-brand-panel">
          <div className="brand-logo" aria-label="shineeMart">
            <span className="brand-mark" aria-hidden="true">
              <svg viewBox="0 0 48 48" fill="none">
                <path d="M9 17h30l-3 23H12L9 17Z" />
                <path d="M17 19v-5a7 7 0 0 1 14 0v5" />
                <path d="m20 28 3 3 6-7" />
              </svg>
            </span>
            <span>shinee<span className="brand-logo-accent">Mart</span></span>
          </div>

          <div className="brand-message">
            <p className="brand-kicker">A little joy in every delivery</p>
            <h2>Find what you love.<br />We&apos;ll bring it to you.</h2>
            <p className="brand-description">
              Discover everyday essentials and thoughtful finds, all in one place.
            </p>
          </div>

          <div className="brand-decoration brand-decoration-one" aria-hidden="true" />
          <div className="brand-decoration brand-decoration-two" aria-hidden="true" />
          <div className="brand-panel-footer">SHOP HAPPY <span>•</span> LIVE BRIGHT</div>
        </aside>

        <div className="login-content-panel">
          <nav className="login-portal-switch" aria-label="Choose portal">
            <span className="portal-choice portal-choice-active" aria-current="page">
              Customer
            </span>
            <Link className="portal-choice" to="/dashboard">Admin Portal</Link>
          </nav>

          <div className="login-heading">
            <p className="login-eyebrow">WELCOME BACK</p>
            <h1>Secure Sign In</h1>
            <p>Enter your email and password to continue shopping.</p>
          </div>

          <form className="auth-form" onSubmit={handleLoginCart}>
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />

            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />

            {error && <p className="request-error" role="alert">{error}</p>}

            <button type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Secure Log In'}
            </button>
          </form>

          <p className="login-signup-prompt">
            New to ShineeMart? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </section>
    </main>
  )
}

export default LoginCart