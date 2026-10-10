import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest } from '../services/api.js'

const readCustomer = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}')
  } catch (error) {
    console.error('Could not read saved customer profile:', error)
    return {}
  }
}

const readCartCount = () => {
  try {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    return Array.isArray(cart)
      ? cart.reduce((count, item) => count + Number(item.quantity || 1), 0)
      : 0
  } catch (error) {
    console.error('Could not read saved cart:', error)
    return 0
  }
}

const CustomerDashboard = () => {
  const [customer] = useState(readCustomer)
  const [cartCount, setCartCount] = useState(readCartCount)
  const [orderCount, setOrderCount] = useState(null)
  const [wishlistCount, setWishlistCount] = useState(null)
  const [orderError, setOrderError] = useState('')

  useEffect(() => {
    let active = true

    const updateCartCount = () => setCartCount(readCartCount())
    apiRequest('/orders')
      .then((result) => {
        if (active) {
          setOrderCount(result.data.length)
        }
      })
      .catch((error) => {
        if (active) {
          setOrderError(error.message)
        }
      })

    apiRequest('/wishlist')
      .then((result) => {
        if (active) {
          setWishlistCount(result.data.length)
        }
      })
      .catch((error) => {
        if (active) {
          console.error('Could not load wishlist count:', error)
        }
      })

    const updateWishlistCount = () => {
      apiRequest('/wishlist')
        .then((result) => {
          if (active) {
            setWishlistCount(result.data.length)
          }
        })
        .catch((error) => {
          if (active) {
            console.error('Could not refresh wishlist count:', error)
          }
        })
    }
    window.addEventListener('storage', updateCartCount)
    window.addEventListener('focus', updateCartCount)
    window.addEventListener('wishlistchange', updateWishlistCount)

    return () => {
      active = false
      window.removeEventListener('storage', updateCartCount)
      window.removeEventListener('focus', updateCartCount)
      window.removeEventListener('wishlistchange', updateWishlistCount)
    }
  }, [])

  return (
    <main className="customer-dashboard-page">
      <div className="customer-dashboard">
        <section className="customer-welcome">
          <span className="page-eyebrow">CUSTOMER DASHBOARD</span>
          <h1>Welcome{customer.fullName ? `, ${customer.fullName}` : ' back'}!</h1>
          <p>Pick up where you left off or explore something new.</p>
          <Link className="primary-link" to="/shop">Browse Products</Link>
        </section>

        <section className="customer-dashboard-section">
          <h2>Your shopping</h2>
          <div className="customer-dashboard-cards">
            <Link className="customer-dashboard-card" to="/shop">
              <span className="customer-card-icon shop-card-icon" aria-hidden="true">S</span>
              <span className="customer-card-content">
                <strong>Browse products</strong>
                <span>Explore the store and find your next favorite.</span>
              </span>
              <span className="customer-card-arrow" aria-hidden="true">→</span>
            </Link>

            <Link className="customer-dashboard-card" to="/cart">
              <span className="customer-card-icon cart-card-icon" aria-hidden="true">C</span>
              <span className="customer-card-content">
                <strong>Your cart</strong>
                <span>{cartCount} {cartCount === 1 ? 'item' : 'items'} ready for checkout.</span>
              </span>
              <span className="customer-card-arrow" aria-hidden="true">→</span>
            </Link>

            <Link className="customer-dashboard-card" to="/orders">
              <span className="customer-card-icon orders-card-icon" aria-hidden="true">O</span>
              <span className="customer-card-content">
                <strong>Order history</strong>
                <span>
                  {orderError
                    ? 'View and track your orders.'
                    : orderCount === null
                      ? 'Loading your orders...'
                      : `${orderCount} ${orderCount === 1 ? 'order' : 'orders'} placed.`}
                </span>
              </span>
              <span className="customer-card-arrow" aria-hidden="true">→</span>
            </Link>

            <Link className="customer-dashboard-card" to="/wishlist">
              <span className="customer-card-icon wishlist-card-icon" aria-hidden="true">♥</span>
              <span className="customer-card-content">
                <strong>Wishlist</strong>
                <span>
                  {wishlistCount === null
                    ? 'Loading saved products...'
                    : `${wishlistCount} ${wishlistCount === 1 ? 'saved product' : 'saved products'}.`}
                </span>
              </span>
              <span className="customer-card-arrow" aria-hidden="true">→</span>
            </Link>

            <Link className="customer-dashboard-card" to="/profile">
              <span className="customer-card-icon profile-card-icon" aria-hidden="true">P</span>
              <span className="customer-card-content">
                <strong>Your profile</strong>
                <span>Keep your contact and delivery details up to date.</span>
              </span>
              <span className="customer-card-arrow" aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}

export default CustomerDashboard
