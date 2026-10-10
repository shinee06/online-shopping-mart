import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import UserService from '../../services/UserService.jsx'

const AdminLogin = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const user = await UserService.login({ email: email.trim(), password })
      if (user?.role !== 'admin') {
        UserService.logout()
        setError('This account does not have administrator access.')
        return
      }
      navigate('/admin', { replace: true })
    } catch (requestError) {
      setError(requestError.message || 'Could not sign in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page auth-login-page">
      <section className="login-shell" aria-label="ShineeMart admin sign in">
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
              Manage your store and help every customer shop with ease.
            </p>
          </div>

          <div className="brand-decoration brand-decoration-one" aria-hidden="true" />
          <div className="brand-decoration brand-decoration-two" aria-hidden="true" />
          <div className="brand-panel-footer">SHOP HAPPY <span>•</span> LIVE BRIGHT</div>
        </aside>

        <div className="login-content-panel">
          <nav className="login-portal-switch" aria-label="Choose portal">
            <Link className="portal-choice" to="/login">Customer</Link>
            <span className="portal-choice portal-choice-active" aria-current="page">
              Admin Portal
            </span>
          </nav>

          <div className="login-heading">
            <p className="login-eyebrow">STORE MANAGEMENT</p>
            <h1>Admin Sign In</h1>
            <p>Sign in with an account that has administrator access.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label htmlFor="admin-login-email">Email</label>
            <input
              id="admin-login-email"
              type="email"
              name="email"
              placeholder="Enter your email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            <label htmlFor="admin-login-password">Password</label>
            <input
              id="admin-login-password"
              type="password"
              name="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />

            {error && <p className="request-error" role="alert">{error}</p>}

            <button type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Secure Log In'}
            </button>
          </form>

          <p className="login-signup-prompt">
            Need the first admin account? <Link to="/admin/register">Create it here</Link>
          </p>
        </div>
      </section>
    </main>
  )
}

export default AdminLogin
