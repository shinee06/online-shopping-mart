import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AdminService from '../../services/AdminService.jsx'

const AdminRegister = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    setupKey: '',
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
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
    <main className="auth-page">
      <section className="login-container admin-login-card">
        <p className="page-eyebrow">INITIAL ADMIN SETUP</p>
        <h1>Create admin account</h1>
        <p>This setup form is enabled only when the server has an admin setup key and no admin account exists.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="admin-setup-key">Admin setup key</label>
          <input id="admin-setup-key" name="setupKey" type="password" autoComplete="off" value={form.setupKey} onChange={handleChange} required />
          <label htmlFor="admin-register-name">Full name</label>
          <input id="admin-register-name" name="fullName" autoComplete="name" value={form.fullName} onChange={handleChange} maxLength="150" required />
          <label htmlFor="admin-register-email">Email</label>
          <input id="admin-register-email" name="email" type="email" autoComplete="email" value={form.email} onChange={handleChange} required />
          <label htmlFor="admin-register-phone">Phone</label>
          <input id="admin-register-phone" name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={handleChange} />
          <label htmlFor="admin-register-password">Password</label>
          <input id="admin-register-password" name="password" type="password" autoComplete="new-password" minLength="8" maxLength="128" value={form.password} onChange={handleChange} required />
          <label htmlFor="admin-register-confirm">Confirm password</label>
          <input id="admin-register-confirm" name="confirmPassword" type="password" autoComplete="new-password" value={form.confirmPassword} onChange={handleChange} required />
          {error && <p className="request-error" role="alert">{error}</p>}
          <button type="submit" disabled={loading}>{loading ? 'Creating account…' : 'Create admin account'}</button>
        </form>
        <p><Link to="/admin/login">Return to admin sign in</Link></p>
      </section>
    </main>
  )
}

export default AdminRegister
