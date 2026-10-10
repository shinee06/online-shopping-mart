import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiRequest, saveAuthentication } from '../services/api.js'
import shineemartLogo from '../assets/shineemart-logo.svg'

const FieldIcon = ({ type }) => {
  const paths = {
    user: <><circle cx="12" cy="8" r="3.2" /><path d="M5.5 20a6.5 6.5 0 0 1 13 0" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
    phone: <path d="M7 3h3l1.5 4-2 1.5a15 15 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2C10.7 19 5 13.3 5 7a2 2 0 0 1 2-2Z" />,
    lock: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 1 1 8 0v3m-4 5v2" /></>
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[type]}</svg>
}

const Register = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((previous) => ({ ...previous, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const result = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ fullName: formData.fullName, email: formData.email, phone: formData.phone, password: formData.password })
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
    <main className="auth-page register-page">
      <section className="register-shell" aria-label="Create a ShineeMart customer account">
        <aside className="register-brand-panel">
          <Link className="register-logo" to="/" aria-label="ShineeMart home">
            <img src={shineemartLogo} alt="ShineeMart — Shop with ease" />
          </Link>
          <div className="register-brand-copy">
            <p className="register-kicker">A BETTER WAY TO SHOP</p>
            <h1>Your shopping<br />journey <span>starts here</span></h1>
            <p className="register-brand-description">Create your account for a smoother, smarter way to shop.</p>
          </div>
          <div className="register-benefits" aria-label="Shopping benefits">
            <div><span className="register-benefit-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m13 2-8 12h6l-1 8 9-13h-6l1-7Z" /></svg></span><strong>Fast checkout</strong><small>Shop with ease<br />and save time.</small></div>
            <div><span className="register-benefit-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h12v11H3zM15 10h4l3 4v4h-7z" /><circle cx="7" cy="19" r="2" /><circle cx="18" cy="19" r="2" /></svg></span><strong>Order updates</strong><small>Track your orders<br />in real time.</small></div>
            <div><span className="register-benefit-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="M3 12l9 5 9-5M3 16l9 5 9-5" /></svg></span><strong>Exclusive offers</strong><small>Get special deals<br />just for you.</small></div>
          </div>
          <div className="register-shopping-art" aria-hidden="true">
            <span className="register-art-sparkle">✦</span><span className="register-art-heart">♡</span>
            <div className="register-shopping-bag"><span>S</span></div>
            <div className="register-parcel register-parcel-one" /><div className="register-parcel register-parcel-two" />
            <span className="register-art-cart">♧</span>
          </div>
        </aside>

        <div className="register-form-side">
          <div className="register-card">
            <div className="register-card-heading">
              <span className="register-heading-icon"><FieldIcon type="user" /></span>
              <div><h2>Create your account</h2><p>Join ShineeMart and enjoy a world of great products, exclusive offers and seamless shopping.</p></div>
            </div>

            <form className="register-form" onSubmit={handleSubmit}>
              <label htmlFor="register-full-name">Full Name <span>*</span></label>
              <div className="register-input-wrap"><FieldIcon type="user" /><input id="register-full-name" name="fullName" type="text" placeholder="Enter your full name" value={formData.fullName} onChange={handleChange} autoComplete="name" required /></div>

              <label htmlFor="register-email">Email <span>*</span></label>
              <div className="register-input-wrap"><FieldIcon type="mail" /><input id="register-email" name="email" type="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} autoComplete="email" required /></div>

              <label htmlFor="register-phone">Phone <span>*</span></label>
              <div className="register-input-wrap"><FieldIcon type="phone" /><input id="register-phone" name="phone" type="tel" placeholder="Enter your phone number" value={formData.phone} onChange={handleChange} autoComplete="tel" required /></div>

              <label htmlFor="register-password">Password <span>*</span></label>
              <div className="register-input-wrap"><FieldIcon type="lock" /><input id="register-password" name="password" type={showPassword ? 'text' : 'password'} placeholder="At least 8 characters" value={formData.password} onChange={handleChange} autoComplete="new-password" minLength="8" required /><button className="register-password-toggle" type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((visible) => !visible)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.2-6 9.5-6 9.5 6 9.5 6-3.2 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="2.5" /></svg></button></div>
              <div className="register-password-strength" aria-live="polite"><span className={formData.password.length >= 8 ? 'is-strong' : ''} /><small>{formData.password.length >= 8 ? 'Password length is good' : 'Password must be at least 8 characters'}</small></div>

              <label htmlFor="register-confirm-password">Confirm Password <span>*</span></label>
              <div className="register-input-wrap"><FieldIcon type="lock" /><input id="register-confirm-password" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="Re-enter your password" value={formData.confirmPassword} onChange={handleChange} autoComplete="new-password" required /><button className="register-password-toggle" type="button" aria-label={showConfirmPassword ? 'Hide password' : 'Show password'} onClick={() => setShowConfirmPassword((visible) => !visible)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.2-6 9.5-6 9.5 6 9.5 6-3.2 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="2.5" /></svg></button></div>

              {error && <p className="register-error" role="alert">{error}</p>}
              <button className="register-submit" type="submit" disabled={loading}>{loading ? 'Creating account…' : <>Create Account <span aria-hidden="true">→</span></>}</button>
            </form>
            <p className="register-login-prompt">Already have an account? <Link to="/login">Log in</Link></p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Register
