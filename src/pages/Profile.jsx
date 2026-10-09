import { useState } from 'react'
import { Link } from 'react-router-dom'

const defaultUser = {
  fullName: 'John Doe',
  email: 'john@example.com',
  phone: '+91 98765 43210',
  address: '123 Market Street, Bengaluru'
}

const Profile = () => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = JSON.parse(localStorage.getItem('user') || 'null')
      return savedUser || defaultUser
    } catch (error) {
      console.log('Error reading user profile:', error)
      return defaultUser
    }
  })

  const handleChange = (e) => {
    const { name, value } = e.target

    setUser((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = (e) => {
    e.preventDefault()

    try {
      localStorage.setItem('user', JSON.stringify(user))
      alert('Profile saved successfully!')
    } catch (error) {
      console.log('Error saving user profile:', error)
      alert('Something went wrong while saving your profile.')
    }
  }

  return (
    <main className="profile-page">
      <section className="profile-card">
        <Link className="profile-back-link" to="/dashboard">
          Back to Dashboard
        </Link>

        <header className="profile-heading">
          <div className="profile-avatar" aria-hidden="true">
            {(user.fullName || 'U').trim().charAt(0).toUpperCase()}
          </div>
          <h1>My Profile</h1>
          <p>Manage your personal information and delivery details.</p>
        </header>

        <form className="profile-form" onSubmit={handleSave}>
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
              onChange={handleChange}
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
        </form>
      </section>
    </main>
  )
}

export default Profile
