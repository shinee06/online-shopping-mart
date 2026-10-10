import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest } from '../services/api.js'
import CartService from '../services/CartService.jsx'

const wishlistImages = [
  'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=700&q=85',
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=700&q=85',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=85',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=85',
  'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=700&q=85'
]

const getProductImage = (product, index) => {
  if (product.image || product.imageUrl || product.thumbnail) return product.image || product.imageUrl || product.thumbnail
  const name = String(product.name || '').toLowerCase()
  const imageIndex = name.includes('laptop') ? 0
    : name.includes('mobile') || name.includes('phone') ? 1
      : name.includes('headphone') || name.includes('audio') ? 2
        : name.includes('watch') ? 3
          : name.includes('camera') ? 4
            : index % wishlistImages.length
  return wishlistImages[imageIndex]
}

const formatPrice = (price) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
}).format(Number(price) || 0)

const Wishlist = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sortBy, setSortBy] = useState('saved')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    let active = true
    apiRequest('/wishlist')
      .then((result) => { if (active) setProducts(Array.isArray(result.data) ? result.data : []) })
      .catch((requestError) => { if (active) setError(requestError.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const sortedProducts = useMemo(() => {
    const sorted = [...products]
    if (sortBy === 'price-low') sorted.sort((a, b) => Number(a.price) - Number(b.price))
    if (sortBy === 'price-high') sorted.sort((a, b) => Number(b.price) - Number(a.price))
    if (sortBy === 'name') sorted.sort((a, b) => String(a.name).localeCompare(String(b.name)))
    return sorted
  }, [products, sortBy])

  const handleRemove = async (productId) => {
    setError('')
    setNotice('')
    try {
      await apiRequest(`/wishlist/${productId}`, { method: 'DELETE' })
      setProducts((current) => current.filter((product) => product.id !== productId))
      window.dispatchEvent(new Event('wishlistchange'))
      setNotice('Item removed from your wishlist.')
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const handleAddToCart = (product) => {
    setError('')
    try {
      CartService.add(product)
      window.dispatchEvent(new Event('cartchange'))
      setNotice(`${product.name} added to your cart.`)
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <main className="wishlist-store-page">
      <div className="wishlist-store-content">
        <section className="wishlist-hero">
          <div className="wishlist-hero-copy">
            <span className="wishlist-eyebrow"><span aria-hidden="true">♥</span> YOUR WISHLIST</span>
            <h1>All your favorite electronics,<br />in one place.</h1>
            <p>Keep track of the products you love and get back to them anytime.</p>
          </div>
          <img src="https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=900&q=85" alt="A selection of electronic devices" />
        </section>

        <div className="wishlist-toolbar">
          <div className="wishlist-title-group">
            <span className="wishlist-title-heart" aria-hidden="true">♥</span>
            <div><h2>My Wishlist</h2><span>{products.length} {products.length === 1 ? 'item' : 'items'}</span></div>
          </div>
          <label className="wishlist-sort"><span aria-hidden="true">☷</span><span>Sort by</span>
            <select aria-label="Sort wishlist" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="saved">Recently saved</option>
              <option value="name">Name</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
            </select>
          </label>
        </div>

        {error && <p className="wishlist-feedback wishlist-feedback-error" role="alert">{error}</p>}
        {notice && <p className="wishlist-feedback" role="status">{notice}</p>}
        {loading ? <p className="wishlist-empty-state">Loading your wishlist…</p>
          : products.length === 0 ? (
            <section className="wishlist-empty-state">
              <span aria-hidden="true">♡</span>
              <h2>Your wishlist is empty</h2>
              <p>Save products you love and they’ll be waiting here.</p>
              <Link className="wishlist-browse-button" to="/shop">Browse products</Link>
            </section>
          ) : (
            <section className="wishlist-product-list" aria-label="Saved products">
              {sortedProducts.map((product, index) => (
                <article className="wishlist-product-row" key={product.id}>
                  <Link className="wishlist-product-image" to={`/shop/products/${product.id}`} aria-label={`View ${product.name}`}>
                    <img src={getProductImage(product, index)} alt={product.name} loading="lazy" />
                  </Link>
                  <div className="wishlist-product-details">
                    <span className="wishlist-product-category">{product.category || 'Electronics'}</span>
                    <h3><Link to={`/shop/products/${product.id}`}>{product.name}</Link></h3>
                    <div className="wishlist-product-rating" aria-label="Popular product">★ <span>Popular pick</span></div>
                    {product.description && <p>{product.description}</p>}
                    <strong>{formatPrice(product.price)}</strong>
                  </div>
                  <div className="wishlist-row-actions">
                    <button className="wishlist-remove-button" type="button" aria-label={`Remove ${product.name} from wishlist`} title="Remove from wishlist" onClick={() => handleRemove(product.id)}>
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3" /></svg>
                    </button>
                    <button className="wishlist-cart-button" type="button" onClick={() => handleAddToCart(product)}>
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h8.4a2 2 0 0 0 1.9-1.4L21 8H6" /><circle cx="10" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></svg>
                      Add to Cart
                    </button>
                  </div>
                </article>
              ))}
            </section>
          )}
      </div>
    </main>
  )
}

export default Wishlist
