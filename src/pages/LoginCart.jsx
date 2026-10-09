import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const LoginCart = () => {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleLoginCart = (e) => {
    e.preventDefault()

    setError('')
    setMessage('')

    if (email === '' || password === '') {
      setError('Please enter email and password')
      return
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    const userData = {
      fullName: 'Customer User',
      email,
      phone: '+91 90000 00000',
      address: 'Your address'
    }

    localStorage.setItem('user', JSON.stringify(userData))
    setMessage('Login successful!')

    navigate('/dashboard')
  }

  return (
    <div className="login-container">
      <h1>Online Shopping Mart</h1>

      <h2>Login</h2>

      <form onSubmit={handleLoginCart}>
        <label>Email</label>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br />
        <br />

        <label>Password</label>

        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br />
        <br />

        <button type="submit">Log in</button>
      </form>

      <p>{error}</p>
      <p>{message}</p>
      <p>
        Don&apos;t have an account? <Link to="/register">Create one</Link>
      </p>
    </div>
  )
}

export default LoginCart