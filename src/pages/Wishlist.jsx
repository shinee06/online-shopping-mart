import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest } from '../services/api.js'

const Wishlist = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    apiRequest('/wishlist')
      .then((result) => {
        if (active) {
          setProducts(result.data)
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

  const handleRemove = async (productId) => {
    setError('')

    try {
      await apiRequest(`/wishlist/${productId}`, { method: 'DELETE' })
      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== productId)
      )
      window.dispatchEvent(new Event('wishlistchange'))
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <main className="wishlist-page">
      <header className="page-heading">
        <span className="page-eyebrow">SAVED FOR LATER</span>
        <h1>My Wishlist</h1>
        <p>Products you have saved for your next visit.</p>
      </header>

      <Link className="text-link wishlist-back-link" to="/customer-dashboard">
        ← Back to Dashboard
      </Link>

      {error && <p className="request-error" role="alert">{error}</p>}
      {loading ? (
        <p>Loading your wishlist...</p>
      ) : products.length === 0 ? (
        <section className="empty-state">
          <p>Your wishlist is empty. Save products you like while browsing.</p>
          <Link className="primary-link" to="/shop">Browse Products</Link>
        </section>
      ) : (
        <section className="wishlist-list">
          {products.map((product) => (
            <article className="wishlist-item" key={product.id}>
              <div className="wishlist-product-copy">
                <h2>{product.name}</h2>
                <p>{product.description}</p>
                <strong className="product-price">₹{product.price}</strong>
              </div>
              <div className="wishlist-actions">
                <Link className="primary-link" to={`/shop/products/${product.id}`}>
                  View Product
                </Link>
                <button
                  className="danger-button"
                  onClick={() => handleRemove(product.id)}
                >
                  Remove
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  )
}

export default Wishlist
