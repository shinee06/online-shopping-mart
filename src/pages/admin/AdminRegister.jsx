import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AdminService from '../../services/AdminService.jsx'
import shineemartLogo from '../../assets/shineemart-logo.svg'

const AdminFieldIcon = ({ type }) => {
  const icons = {
    lock: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 1 1 8 0v3m-4 5v2" /></>,
    user: <><circle cx="12" cy="8" r="3.2" /><path d="M5.5 20a6.5 6.5 0 0 1 13 0" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
    phone: <path d="M7 3h3l1.5 4-2 1.5a15 15 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2C10.7 19 5 13.3 5 7a2 2 0 0 1 2-2Z" />
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true">{icons[type]}</svg>
}

const AdminRegister = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ setupKey: '', fullName: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      await AdminService.registerAdmin({
        setupKey: form.setupKey,
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        password: form.password
      })
      navigate('/admin', { replace: true })
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page register-page admin-register-page">
      <section className="register-shell" aria-label="Create the initial ShineeMart administrator account">
        <aside className="register-brand-panel">
          <Link className="register-logo" to="/" aria-label="ShineeMart home"><img src={shineemartLogo} alt="ShineeMart — Shop with ease" /></Link>
          <div className="register-brand-copy">
            <p className="register-kicker">STORE ADMINISTRATION</p>
            <h1>Manage your store<br />with <span>confidence</span></h1>
            <p className="register-brand-description">Set up secure access to your store workspace and keep every detail in reach.</p>
          </div>
          <div className="register-benefits" aria-label="Administrator benefits">
            <div><span className="register-benefit-icon"><AdminFieldIcon type="lock" /></span><strong>Secure access</strong><small>Protected admin<br />workspace.</small></div>
            <div><span className="register-benefit-icon"><AdminFieldIcon type="user" /></span><strong>Team controls</strong><small>Manage your people<br />and customers.</small></div>
            <div><span className="register-benefit-icon"><AdminFieldIcon type="mail" /></span><strong>Store insights</strong><small>Keep track of daily<br />store activity.</small></div>
          </div>
          <div className="register-shopping-art" aria-hidden="true"><span className="register-art-sparkle">✦</span><span className="register-art-heart">⌂</span><div className="register-shopping-bag"><span>S</span></div><div className="register-parcel register-parcel-one" /><div className="register-parcel register-parcel-two" /><span className="register-art-cart">▦</span></div>
        </aside>

        <div className="register-form-side">
          <div className="register-card">
            <div className="register-card-heading">
              <span className="register-heading-icon"><AdminFieldIcon type="user" /></span>
              <div><p className="admin-register-eyebrow">INITIAL ADMIN SETUP</p><h2>Create admin account</h2><p>Use your server setup key to create the first store administrator.</p></div>
            </div>
            <form className="register-form" onSubmit={handleSubmit}>
              <label htmlFor="admin-setup-key">Admin setup key <span>*</span></label>
              <div className="register-input-wrap"><AdminFieldIcon type="lock" /><input id="admin-setup-key" name="setupKey" type="password" placeholder="Enter the server setup key" autoComplete="off" value={form.setupKey} onChange={handleChange} required /></div>

              <label htmlFor="admin-register-name">Full name <span>*</span></label>
              <div className="register-input-wrap"><AdminFieldIcon type="user" /><input id="admin-register-name" name="fullName" placeholder="Enter your full name" autoComplete="name" maxLength="150" value={form.fullName} onChange={handleChange} required /></div>

              <label htmlFor="admin-register-email">Email <span>*</span></label>
              <div className="register-input-wrap"><AdminFieldIcon type="mail" /><input id="admin-register-email" name="email" type="email" placeholder="Enter your email" autoComplete="email" value={form.email} onChange={handleChange} required /></div>

              <label htmlFor="admin-register-phone">Phone</label>
              <div className="register-input-wrap"><AdminFieldIcon type="phone" /><input id="admin-register-phone" name="phone" type="tel" placeholder="Enter your phone number" autoComplete="tel" value={form.phone} onChange={handleChange} /></div>

              <label htmlFor="admin-register-password">Password <span>*</span></label>
              <div className="register-input-wrap"><AdminFieldIcon type="lock" /><input id="admin-register-password" name="password" type={showPassword ? 'text' : 'password'} placeholder="At least 8 characters" autoComplete="new-password" minLength="8" maxLength="128" value={form.password} onChange={handleChange} required /><button className="register-password-toggle" type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((visible) => !visible)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.2-6 9.5-6 9.5 6 9.5 6-3.2 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="2.5" /></svg></button></div>
              <div className="register-password-strength" aria-live="polite"><span className={form.password.length >= 8 ? 'is-strong' : ''} /><small>{form.password.length >= 8 ? 'Password length is good' : 'Password must be at least 8 characters'}</small></div>

              <label htmlFor="admin-register-confirm">Confirm password <span>*</span></label>
              <div className="register-input-wrap"><AdminFieldIcon type="lock" /><input id="admin-register-confirm" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="Re-enter your password" autoComplete="new-password" value={form.confirmPassword} onChange={handleChange} required /><button className="register-password-toggle" type="button" aria-label={showConfirmPassword ? 'Hide password' : 'Show password'} onClick={() => setShowConfirmPassword((visible) => !visible)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.2-6 9.5-6 9.5 6 9.5 6-3.2 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="2.5" /></svg></button></div>

              {error && <p className="register-error" role="alert">{error}</p>}
              <button className="register-submit" type="submit" disabled={loading}>{loading ? 'Creating account…' : <>Create admin account <span aria-hidden="true">→</span></>}</button>
            </form>
            <p className="register-login-prompt">Already have an admin account? <Link to="/admin/login">Sign in</Link></p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default AdminRegister
