import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest } from '../services/api.js'

const readSavedUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null') || { fullName: '', email: '', phone: '', address: '' }
  } catch {
    return { fullName: '', email: '', phone: '', address: '' }
  }
}

const Profile = () => {
  const [user, setUser] = useState(readSavedUser)
  const [message, setMessage] = useState('')
  const [messageIsError, setMessageIsError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let active = true
    apiRequest('/customers/me')
      .then((result) => {
        if (active) {
          setUser((current) => ({ ...current, ...result.data }))
          localStorage.setItem('user', JSON.stringify(result.data))
        }
      })
      .catch((requestError) => {
        if (active) {
          setMessage(requestError.message)
          setMessageIsError(true)
        }
      })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setUser((current) => ({ ...current, [name]: value }))
  }

  const handleSave = async (event) => {
    event.preventDefault()
    setMessage('')
    setMessageIsError(false)
    setSaving(true)
    try {
      const result = await apiRequest('/customers/me', {
        method: 'PUT',
        body: JSON.stringify({ fullName: user.fullName, phone: user.phone, address: user.address })
      })
      const updatedUser = { ...user, ...result.data }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setMessage(result.message || 'Your profile has been updated.')
    } catch (requestError) {
      setMessage(requestError.message)
      setMessageIsError(true)
    } finally {
      setSaving(false)
    }
  }

  const initials = user.fullName?.trim().charAt(0).toUpperCase() || 'U'

  const focusField = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' })

  return (
    <main className="profile-store-page">
      <div className="profile-store-content">
        <nav className="profile-breadcrumbs" aria-label="Breadcrumb"><Link to="/dashboard" aria-label="Home">⌂</Link><span aria-hidden="true">›</span><span>Profile</span></nav>
        <header className="profile-store-heading"><h1>My Profile</h1><p>Manage your personal information and delivery details.</p></header>

        <div className="profile-store-layout">
          <section className="profile-editor-card" aria-label="Edit profile">
            <aside className="profile-editor-sidebar">
              <div className="profile-avatar-large" aria-label={`Profile avatar for ${user.fullName || 'user'}`}>{initials}</div>
              <strong>{user.fullName || 'Your name'}</strong>
              <span className="profile-role-label">{user.role === 'admin' ? 'Administrator' : 'Customer'}</span>
              <nav className="profile-section-nav" aria-label="Profile sections">
                <button className="active" type="button" onClick={() => focusField('profile-full-name')}><span aria-hidden="true">♙</span> Personal Information</button>
                <button type="button" onClick={() => focusField('profile-phone')}><span aria-hidden="true">⌕</span> Contact Details</button>
                <button type="button" onClick={() => focusField('profile-address')}><span aria-hidden="true">⌖</span> Delivery Address</button>
              </nav>
            </aside>

            <form className="profile-store-form" onSubmit={handleSave}>
              <header><span className="profile-form-icon" aria-hidden="true">♙</span><div><h2>Personal Information</h2><p>Update your basic details.</p></div></header>
              {loading && <p className="profile-loading">Loading your profile…</p>}
              <div className="profile-store-field" id="profile-name-section">
                <label htmlFor="profile-full-name">Full Name <span>*</span></label>
                <input id="profile-full-name" type="text" name="fullName" autoComplete="name" value={user.fullName || ''} onChange={handleChange} maxLength="150" required />
              </div>
              <div className="profile-store-field" id="profile-email-section">
                <label htmlFor="profile-email">Email Address <span>*</span></label>
                <div className="profile-email-row"><input id="profile-email" type="email" autoComplete="email" value={user.email || ''} readOnly /><span>✓ Verified</span></div>
              </div>
              <div className="profile-store-field" id="profile-contact-section">
                <label htmlFor="profile-phone">Phone Number <span>*</span></label>
                <input id="profile-phone" type="tel" name="phone" autoComplete="tel" value={user.phone || ''} onChange={handleChange} maxLength="40" required />
              </div>
              <div className="profile-store-field" id="profile-address-section">
                <label htmlFor="profile-address">Delivery Address</label>
                <textarea id="profile-address" name="address" autoComplete="street-address" value={user.address || ''} onChange={handleChange} rows="3" maxLength="1000" />
              </div>
              <div className="profile-safe-note"><span aria-hidden="true">✓</span><div><strong>Your information is safe with us</strong><small>We respect your privacy and keep your details secure.</small></div></div>
              {message && <p className={`profile-save-message${messageIsError ? ' is-error' : ''}`} role={messageIsError ? 'alert' : 'status'}>{message}</p>}
              <button className="profile-store-save" type="submit" disabled={saving || loading}>{saving ? 'Saving…' : 'Save Changes'}</button>
            </form>
          </section>

          <aside className="profile-store-aside">
            <section className="profile-summary-card">
              <h2><span aria-hidden="true">♙</span> Account Summary</h2>
              <div><span aria-hidden="true">♙</span><p><small>Full Name</small><strong>{user.fullName || 'Not provided'}</strong></p></div>
              <div><span aria-hidden="true">✉</span><p><small>Email</small><strong>{user.email || 'Not provided'}</strong></p></div>
              <div><span aria-hidden="true">⌕</span><p><small>Phone</small><strong>{user.phone || 'Not provided'}</strong></p></div>
              <div><span aria-hidden="true">⌖</span><p><small>Delivery Address</small><strong>{user.address || 'Add an address to your profile'}</strong></p></div>
            </section>
            <section className="profile-shop-card">
              <span className="profile-shop-bag" aria-hidden="true">♡</span>
              <div><strong>Shop More, Save More!</strong><p>Find something new for your everyday.</p><Link to="/shop">Browse products <span aria-hidden="true">→</span></Link></div>
            </section>
            <Link className="profile-orders-card" to="/orders"><span aria-hidden="true">▤</span><span><strong>Order history</strong><small>View and track your orders.</small></span><span aria-hidden="true">›</span></Link>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default Profile
