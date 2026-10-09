import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest } from '../services/api.js'

const Profile = () => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null') || {
        fullName: '',
        email: '',
        phone: '',
        address: ''
      }
    } catch (error) {
      console.log('Error reading user profile:', error)
      return { fullName: '', email: '', phone: '', address: '' }
    }
  })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    apiRequest('/customers/me')
      .then((result) => {
        if (active) {
          setUser(result.data)
          localStorage.setItem('user', JSON.stringify(result.data))
        }
      })
      .catch((error) => {
        if (active) {
          setMessage(error.message)
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target

    setUser((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setMessage('')

    try {
      const result = await apiRequest('/customers/me', {
        method: 'PUT',
        body: JSON.stringify({
          fullName: user.fullName,
          phone: user.phone,
          address: user.address
        })
      })
      const updatedUser = { ...user, ...result.data }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setMessage(result.message)
    } catch (error) {
      setMessage(error.message)
    }
  }


  return (
    <main className="profile-page">
      <section className="profile-card">
        <Link className="profile-back-link" to="/customer-dashboard">
          Back to My Dashboard
        </Link>

        <header className="profile-heading">
          <div className="profile-avatar" aria-hidden="true">
            {(user.fullName || 'U').trim().charAt(0).toUpperCase()}
          </div>
          <h1>My Profile</h1>
          <p>Manage your personal information and delivery details.</p>
        </header>

        <form className="profile-form" onSubmit={handleSave}>
          {loading && <p>Loading profile...</p>}

          <div className="profile-field">
            <label htmlFor="profile-full-name">Full Name</label>
            <input
              id="profile-full-name"
              type="text"
              name="fullName"
              value={user.fullName}
              onChange={handleChange}
            />
          </div>

          <div className="profile-field">
            <label htmlFor="profile-email">Email</label>
            <input
              id="profile-email"
              type="email"
              name="email"
              value={user.email}
              readOnly
            />
          </div>

          <div className="profile-field">
            <label htmlFor="profile-phone">Phone</label>
            <input
              id="profile-phone"
              type="tel"
              name="phone"
              value={user.phone}
              onChange={handleChange}
            />
          </div>

          <div className="profile-field">
            <label htmlFor="profile-address">Address</label>
            <textarea
              id="profile-address"
              name="address"
              value={user.address}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <button className="profile-save-button" type="submit">
            Save Profile
          </button>
          {message && <p role="status">{message}</p>}
        </form>

      </section>
    </main>
  )
}

export default Profile
