import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Checkout = () => {
  const navigate = useNavigate()

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
    fullName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    phone: ''
  })

  const subtotal = useMemo(
    () =>
      cart.reduce(
        (sum, product) => sum + Number(product.price || 0),
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

  const handlePlaceOrder = (e) => {
    e.preventDefault()

    if (cart.length === 0) {
      alert('Your cart is empty. Add some products before checkout.')
      return
    }

    const order = {
      id: Date.now(),
      customer: {
        fullName: formData.fullName,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        zipCode: formData.zipCode,
        phone: formData.phone
      },
      items: cart,
      subtotal,
      shipping,
      total,
      createdAt: new Date().toISOString()
    }

    try {
      const existingOrders = JSON.parse(
        localStorage.getItem('orders') || '[]'
      )

      localStorage.setItem(
        'orders',
        JSON.stringify([...existingOrders, order])
      )

      localStorage.setItem('cart', JSON.stringify([]))
      setCart([])
      navigate('/orders')
    } catch (error) {
      console.log('Error placing order:', error)
      alert('Something went wrong while placing your order.')
    }
  }

  if (cart.length === 0) {
    return (
      <div>
        <h1>Checkout</h1>
        <p>Your cart is empty.</p>
        <Link to="/products">Continue shopping</Link>
      </div>
    )
  }

  return (
    <div>
      <h1>Checkout</h1>

      <Link to="/cart">Back to Cart</Link>

      <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
        <form
          onSubmit={handlePlaceOrder}
          style={{ flex: 1 }}
        >
          <h2>Shipping Details</h2>

          <div>
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>ZIP Code</label>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit">Place Order</button>
        </form>

        <div style={{ flex: 1 }}>
          <h2>Order Summary</h2>

          {cart.map((product) => (
            <div key={product.id}>
              <h3>{product.name}</h3>
              <p>Price: ₹{product.price}</p>
            </div>
          ))}

          <hr />

          <p>Subtotal: ₹{subtotal}</p>
          <p>Shipping: ₹{shipping}</p>
          <h3>Total: ₹{total}</h3>
        </div>
      </div>
    </div>
  )
}

export default Checkout
