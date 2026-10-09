import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiRequest } from '../services/api.js'

const Shop = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [wishlistIds, setWishlistIds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [wishlistError, setWishlistError] = useState('')

  useEffect(() => {
    let active = true

    apiRequest('/products')
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

    apiRequest('/wishlist')
      .then((result) => {
        if (active) {
          setWishlistIds(result.data.map((product) => product.id))
        }
      })
      .catch((requestError) => {
        if (active) {
          setWishlistError(requestError.message)
        }
      })

    return () => {
      active = false
    }
  }, [])

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const toggleWishlist = async (productId) => {
    setWishlistError('')

    try {
      if (wishlistIds.includes(productId)) {
        await apiRequest(`/wishlist/${productId}`, { method: 'DELETE' })
        setWishlistIds((ids) => ids.filter((id) => id !== productId))
      } else {
        await apiRequest('/wishlist', {
          method: 'POST',
          body: JSON.stringify({ productId })
        })
        setWishlistIds((ids) => [...ids, productId])
      }
      window.dispatchEvent(new Event('wishlistchange'))
    } catch (requestError) {
      setWishlistError(requestError.message)
    }
  }

  return (
    <main className="products-container">
      <header className="shop-header">
        <div>
          <span className="page-eyebrow">ONLINE SHOPPING MART</span>
          <h1>Find your next favorite</h1>
        </div>
        <nav className="shop-nav" aria-label="Customer navigation">
          <Link to="/customer-dashboard">Dashboard</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/orders">Orders</Link>
          <Link to="/profile">Profile</Link>
          <button className="secondary-button" onClick={handleLogout}>
            Log out
          </button>
        </nav>
      </header>

      <div className="product-controls">
        <input
          type="search"
          placeholder="Search products"
          aria-label="Search products"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {wishlistError && <p className="request-error" role="alert">{wishlistError}</p>}

      {loading ? (
        <p className="no-products">Loading products...</p>
      ) : error ? (
        <p className="request-error" role="alert">{error}</p>
      ) : filteredProducts.length === 0 ? (
        <p className="no-products">No products found.</p>
      ) : (
        <div className="product-list">
          {filteredProducts.map((product) => (
            <article className="product-card" key={product.id}>
              <h2>{product.name}</h2>
              <p className="product-price">₹{product.price}</p>
              <p>{product.description}</p>
              <button onClick={() => navigate(`/shop/products/${product.id}`)}>
                View Details
              </button>
              <button
                className="wishlist-toggle"
                aria-pressed={wishlistIds.includes(product.id)}
                onClick={() => toggleWishlist(product.id)}
              >
                {wishlistIds.includes(product.id) ? '♥ Saved' : '♡ Save'}
              </button>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}

export default Shop
