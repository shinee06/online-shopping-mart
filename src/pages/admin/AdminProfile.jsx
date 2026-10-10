import { useEffect, useState } from 'react'
import UserService from '../../services/UserService.jsx'
import './AdminProfile.css'

const emptyProfile = { fullName: '', email: '', phone: '', address: '' }

const AdminProfile = () => {
  const [profile, setProfile] = useState(emptyProfile)
  const [savedProfile, setSavedProfile] = useState(emptyProfile)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const isDirty = Object.keys(profile).some((key) => profile[key] !== savedProfile[key])
  const initial = String(profile.fullName || 'A').trim().charAt(0).toUpperCase()

  useEffect(() => {
    let active = true
    UserService.getProfile()
      .then((data) => {
        if (!active) return
        const nextProfile = { ...emptyProfile, ...data }
        setProfile(nextProfile)
        setSavedProfile(nextProfile)
      })
      .catch((requestError) => { if (active) setError(requestError.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setProfile((current) => ({ ...current, [name]: value }))
    setError('')
    setMessage('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')
    setSaving(true)
    try {
      const updated = await UserService.updateProfile({
        fullName: profile.fullName.trim(),
        phone: profile.phone.trim(),
        address: profile.address.trim()
      })
      const nextProfile = { ...profile, ...updated, fullName: updated.fullName || profile.fullName.trim() }
      setProfile(nextProfile)
      setSavedProfile(nextProfile)
      setMessage('Your profile details have been saved.')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setProfile(savedProfile)
    setError('')
    setMessage('')
  }

  return (
    <main className="ap">
      <header className="ap-head">
        <h1>My Profile</h1>
        <p>Manage your administrator account and contact details.</p>
      </header>

      {error && <p className="ap-error" role="alert">{error}</p>}
      {loading ? <p className="ap-hint">Loading profile…</p> : (
        <div className="ap-grid">
          <aside className="ap-side">
            <section className="ap-identity">
              <div className="ap-avatar" aria-hidden="true">{initial}</div>
              <h2>{profile.fullName || 'Administrator'}</h2>
              <p className="ap-email">{profile.email}</p>
              <span className="ap-badge">Administrator</span>
              <dl className="ap-facts">
                <div><dt>Account type</dt><dd>Admin</dd></div>
                <div><dt>Phone</dt><dd>{profile.phone || 'Not added'}</dd></div>
              </dl>
            </section>
          </aside>

          <div className="ap-main">
            <form className="ap-panel" onSubmit={handleSubmit}>
              <div className="ap-panel-head"><h3>Personal Information</h3><p>Update the details associated with your administrator account.</p></div>
              <div className="ap-fields two">
                <label className="ap-field" htmlFor="admin-profile-name"><span className="ap-label">Full name</span><input id="admin-profile-name" name="fullName" value={profile.fullName} onChange={handleChange} autoComplete="name" required /></label>
                <label className="ap-field" htmlFor="admin-profile-email"><span className="ap-label">Email address</span><input id="admin-profile-email" type="email" value={profile.email} readOnly /><span className="ap-hint">Your account email can’t be changed here.</span></label>
              </div>
              <div className="ap-fields">
                <label className="ap-field" htmlFor="admin-profile-phone"><span className="ap-label">Phone number</span><input id="admin-profile-phone" name="phone" type="tel" value={profile.phone} onChange={handleChange} autoComplete="tel" /></label>
                <label className="ap-field" htmlFor="admin-profile-address"><span className="ap-label">Address</span><textarea id="admin-profile-address" name="address" rows="3" value={profile.address} onChange={handleChange} autoComplete="street-address" /></label>
              </div>
              {message && <p className="admin-notice" role="status">{message}</p>}
              <div className={`ap-bar${isDirty ? ' show' : ''}`} aria-live="polite">
                <span>You have unsaved changes.</span>
                <div><button className="ap-btn ghost" type="button" onClick={handleCancel} disabled={saving}>Cancel</button><button className="ap-btn primary" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button></div>
              </div>
            </form>

            <section className="ap-panel">
              <div className="ap-panel-head"><h3>Account Summary</h3><p>Administrator access for your store.</p></div>
              <ul className="ap-stats"><li><strong>Admin</strong><span>Account role</span></li><li><strong>{profile.email || '—'}</strong><span>Sign-in email</span></li><li><strong>{profile.phone || '—'}</strong><span>Contact number</span></li></ul>
            </section>
          </div>
        </div>
      )}
    </main>
  )
}

export default AdminProfile
