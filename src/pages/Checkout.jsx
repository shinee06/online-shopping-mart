import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiRequest } from '../services/api.js'

const readStoredCustomer = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}')
  } catch (error) {
    console.error('Could not read saved customer details:', error)
    return {}
  }
}

const Checkout = () => {
  const navigate = useNavigate()
  const savedCustomer = readStoredCustomer()

  const [cart, setCart] = useState(() => {
    try {
      const data = localStorage.getItem('cart')
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.log('Error reading cart:', error)
      return []
    }
  })

  const [formData, setFormData] = useState({
    fullName: savedCustomer.fullName || '',
    email: savedCustomer.email || '',
    address: savedCustomer.address || '',
    city: '',
    zipCode: '',
    phone: savedCustomer.phone || ''
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const subtotal = useMemo(
    () =>
      cart.reduce(
        (sum, product) =>
          sum + Number(product.price || 0) * Number(product.quantity || 1),
        0
      ),
    [cart]
  )

  const shipping = cart.length > 0 ? 200 : 0
  const total = subtotal + shipping

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    setError('')

    if (cart.length === 0) {
      setError('Your cart is empty. Add some products before checkout.')
      return
    }

    setSubmitting(true)
    try {
      await apiRequest('/orders', {
        method: 'POST',
        body: JSON.stringify({
          customer: formData,
          items: cart.map((product) => ({
            productId: product.id,
            quantity: Number(product.quantity || 1)
          }))
        })
      })
      localStorage.setItem('cart', JSON.stringify([]))
      setCart([])
      navigate('/orders')
    } catch (error) {
      setError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (cart.length === 0) {
    return (
      <main className="checkout-page">
        <header className="page-heading">
          <span className="page-eyebrow">ALMOST THERE</span>
          <h1>Checkout</h1>
        </header>
        <section className="empty-state">
          <p>Your cart is empty.</p>
          <Link className="primary-link" to="/products">Continue shopping</Link>
        </section>
      </main>
    )
  }

  return (
    <main className="checkout-page">
      <header className="page-heading">
        <span className="page-eyebrow">ALMOST THERE</span>
        <h1>Checkout</h1>
        <Link className="text-link" to="/cart">← Back to Cart</Link>
      </header>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handlePlaceOrder}>
          <h2>Shipping Details</h2>

          <div>
            <label htmlFor="checkout-full-name">Full Name</label>
            <input
              id="checkout-full-name"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="checkout-email">Email</label>
            <input
              id="checkout-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="checkout-address">Address</label>
            <textarea
              id="checkout-address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="checkout-city">City</label>
            <input
              id="checkout-city"
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="checkout-zip-code">ZIP Code</label>
            <input
              id="checkout-zip-code"
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="checkout-phone">Phone</label>
            <input
              id="checkout-phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          {error && <p className="request-error" role="alert">{error}</p>}
          <button type="submit" disabled={submitting}>
            {submitting ? 'Placing order...' : 'Place Order'}
          </button>
        </form>

        <section className="checkout-summary">
          <h2>Order Summary</h2>

          {cart.map((product) => (
            <div className="checkout-summary-item" key={product.id}>
              <h3>{product.name}</h3>
              <p>₹{product.price} × {product.quantity || 1}</p>
            </div>
          ))}

          <hr />

          <p>Subtotal: ₹{subtotal}</p>
          <p>Shipping: ₹{shipping}</p>
          <h3>Total: ₹{total}</h3>
        </section>
      </div>
    </main>
  )
}

export default Checkout
