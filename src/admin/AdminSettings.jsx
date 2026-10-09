import { useState } from 'react'
import { Link } from 'react-router-dom'

const settingsStorageKey = 'adminSettings'

const defaultSettings = {
  displayName: 'Online Shopping Mart',
  adminEmail: '',
  compactCards: false,
  showDashboardWelcome: true
}

const readSettings = () => {
  try {
    const savedSettings = JSON.parse(
      localStorage.getItem(settingsStorageKey) || 'null'
    )

    return savedSettings
      ? { ...defaultSettings, ...savedSettings }
      : defaultSettings
  } catch (error) {
    console.error('Could not read admin settings:', error)
    return defaultSettings
  }
}

const AdminSettings = () => {
  const [settings, setSettings] = useState(readSettings)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target

    setSettings((currentSettings) => ({
      ...currentSettings,
      [name]: type === 'checkbox' ? checked : value
    }))
    setMessage('')
    setError('')
  }

  const handleSave = (event) => {
    event.preventDefault()
    setMessage('')
    setError('')

    const displayName = settings.displayName.trim()
    const adminEmail = settings.adminEmail.trim()

    if (!displayName) {
      setError('Enter a store display name.')
      return
    }

    if (
      adminEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminEmail)
    ) {
      setError('Enter a valid admin email address.')
      return
    }

    const updatedSettings = {
      ...settings,
      displayName,
      adminEmail
    }

    try {
      localStorage.setItem(
        settingsStorageKey,
        JSON.stringify(updatedSettings)
      )
      setSettings(updatedSettings)
      setMessage('Admin preferences saved in this browser.')
    } catch (storageError) {
      console.error('Could not save admin settings:', storageError)
      setError('Could not save settings. Check browser storage and try again.')
    }
  }

  const handleReset = () => {
    try {
      localStorage.removeItem(settingsStorageKey)
      setSettings(defaultSettings)
      setMessage('Admin preferences restored to their defaults.')
      setError('')
    } catch (storageError) {
      console.error('Could not reset admin settings:', storageError)
      setError('Could not reset settings. Please try again.')
    }
  }

  return (
    <main className="admin-settings-page">
      <header className="admin-settings-header">
        <div>
          <span className="page-eyebrow">ADMINISTRATION</span>
          <h1>Admin Settings</h1>
          <p>Manage the store details and preferences shown in this browser.</p>
        </div>
        <Link className="text-link" to="/dashboard">
          ← Back to Dashboard
        </Link>
      </header>

      <form className="admin-settings-card" onSubmit={handleSave}>
        <section className="admin-settings-section">
          <h2>Store information</h2>
          <p className="admin-settings-help">
            These details are saved locally for this admin interface.
          </p>

          <div className="admin-settings-field">
            <label htmlFor="admin-store-name">Store display name</label>
            <input
              id="admin-store-name"
              name="displayName"
              type="text"
              maxLength="100"
              value={settings.displayName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="admin-settings-field">
            <label htmlFor="admin-email">Admin contact email</label>
            <input
              id="admin-email"
              name="adminEmail"
              type="email"
              maxLength="254"
              placeholder="admin@example.com"
              value={settings.adminEmail}
              onChange={handleChange}
            />
          </div>
        </section>

        <section className="admin-settings-section">
          <h2>Dashboard preferences</h2>
          <label className="admin-settings-toggle" htmlFor="show-welcome">
            <span>
              <strong>Show welcome panel</strong>
              <span>Display the welcome banner on the dashboard.</span>
            </span>
            <input
              id="show-welcome"
              name="showDashboardWelcome"
              type="checkbox"
              checked={settings.showDashboardWelcome}
              onChange={handleChange}
            />
          </label>

          <label className="admin-settings-toggle" htmlFor="compact-cards">
            <span>
              <strong>Compact dashboard cards</strong>
              <span>Use a denser card layout in the admin interface.</span>
            </span>
            <input
              id="compact-cards"
              name="compactCards"
              type="checkbox"
              checked={settings.compactCards}
              onChange={handleChange}
            />
          </label>
        </section>

        {error && <p className="request-error" role="alert">{error}</p>}
        {message && <p className="admin-settings-success" role="status">{message}</p>}

        <div className="admin-settings-actions">
          <button type="submit">Save Preferences</button>
          <button
            className="secondary-button"
            type="button"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>

        <p className="admin-settings-notice">
          These browser-only preferences do not change MySQL data, checkout
          pricing, or backend configuration.
        </p>
      </form>
    </main>
  )
}

export default AdminSettings