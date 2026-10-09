import { Link } from 'react-router-dom'
import { useState } from 'react'

const Orders = () => {
  const [orders] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('orders') || '[]')
    } catch (error) {
      console.log('Error reading orders:', error)
      return []
    }
  })

  return (
    <div>
      <h1>My Orders</h1>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} style={{ border: '1px solid #ccc', marginBottom: '1rem', padding: '1rem' }}>
            <h2>Order #{order.id}</h2>
            <p>Customer: {order.customer.fullName}</p>
            <p>Email: {order.customer.email}</p>
            <p>Address: {order.customer.address}, {order.customer.city}</p>
            <p>Total: ₹{order.total}</p>

            <ul>
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.name} - ₹{item.price}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}

      <Link to="/products">Continue Shopping</Link>
    </div>
  )
}

export default Orders
