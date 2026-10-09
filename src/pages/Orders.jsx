import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import OrderDAO from '../dao/OrderDAO.jsx'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    OrderDAO.getAll()
      .then((data) => {
        if (active) {
          setOrders(data)
        }
      })
      .catch((requestError) => {
        if (active) {
          setError(requestError.message)
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

  return (
    <main className="orders-page">
      <header className="page-heading">
        <span className="page-eyebrow">ORDER HISTORY</span>
        <h1>My Orders</h1>
        <p>Track the orders you have placed.</p>
      </header>

      {loading ? (
        <p>Loading your orders...</p>
      ) : error ? (
        <p className="request-error" role="alert">{error}</p>
      ) : orders.length === 0 ? (
        <section className="empty-state">
          <p>No orders yet.</p>
          <Link className="primary-link" to="/products">Start Shopping</Link>
        </section>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <article className="order-card" key={order.id}>
              <h2>Order #{order.id}</h2>
              <p>Customer: {order.customer.fullName}</p>
              <p>Email: {order.customer.email}</p>
              <p>Address: {order.customer.address}, {order.customer.city}</p>
              <p className="order-total">Total: ₹{order.total}</p>

              <ul>
                {order.items.map((item) => (
                  <li key={`${order.id}-${item.id}`}>
                    {item.name} × {item.quantity} - ₹{item.price}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      )}

      {orders.length > 0 && (
        <Link className="primary-link orders-shopping-link" to="/products">
          Continue Shopping
        </Link>
      )}
    </main>
  )
}

export default Orders
