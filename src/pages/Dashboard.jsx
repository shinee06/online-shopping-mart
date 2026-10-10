import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ProductService from '../services/ProductService.jsx'

const categories = [
  { name: 'Laptops', icon: '▱', keywords: ['laptop', 'notebook'] },
  { name: 'Mobiles', icon: '▯', keywords: ['mobile', 'phone', 'smartphone'] },
  { name: 'Audio', icon: '◖', keywords: ['headphone', 'earbud', 'speaker', 'audio'] },
  { name: 'Smartwatches', icon: '◷', keywords: ['watch'] },
  { name: 'Cameras', icon: '▣', keywords: ['camera'] },
  { name: 'Accessories', icon: '⌁', keywords: ['accessory', 'charger', 'cable'] }
]

const productImages = [
  'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=85'
]

const readCustomer = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null')
  } catch {
    return null
  }
}

const formatPrice = (price) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
}).format(Number(price) || 0)

const Dashboard = () => {
  const navigate = useNavigate()
  const isAuthenticated = Boolean(localStorage.getItem('authToken'))
  const customer = isAuthenticated ? readCustomer() : null
  const firstName = customer?.fullName?.trim().split(/\s+/)[0]
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    ProductService.getAll()
      .then((data) => { if (active) setProducts(Array.isArray(data) ? data : []) })
      .catch((requestError) => { if (active) setError(requestError.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const visibleProducts = products.slice(0, 4)

  return (
    <main className="dashboard-page store-overview">
      <div className="store-overview-content">
        <header className="overview-topbar">
          <div>
            <h1>{isAuthenticated ? `Welcome back${firstName ? `, ${firstName}` : ''}!` : 'Welcome back, Shinee!'}</h1>
            <p>Your one-stop destination for electronics.</p>
          </div>
          {isAuthenticated
            ? <Link className="overview-account-link" to="/profile">My account</Link>
            : <Link className="overview-account-link" to="/login">Sign in</Link>}
        </header>

        <section className="electronics-hero">
          <div className="electronics-hero-copy">
            <span className="overview-eyebrow">DISCOVER THE LATEST TECH</span>
            <h2>Technology made simple.</h2>
            <p>Explore laptops, smartphones, audio devices and more.</p>
            <Link className="electronics-hero-button" to="/products">Explore Electronics <span aria-hidden="true">→</span></Link>
          </div>
          <img
            className="electronics-hero-image"
            src="https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=700&q=85"
            alt="A collection of everyday electronic devices"
          />
        </section>

        <section className="overview-categories" aria-labelledby="overview-categories-heading">
          <div className="overview-section-heading">
            <h2 id="overview-categories-heading">Shop by Category</h2>
            <Link to="/products">View all</Link>
          </div>
          <div className="overview-category-grid">
            {categories.map((category) => (
              <button
                className="overview-category-card"
                type="button"
                key={category.name}
                onClick={() => navigate(`/products?category=${encodeURIComponent(category.name)}`)}
              >
                <span className="overview-category-icon" aria-hidden="true">{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="overview-featured" id="featured-electronics" aria-labelledby="featured-heading">
          <div className="overview-section-heading">
            <h2 id="featured-heading">Featured Electronics</h2>
            <Link to="/products">View all products <span aria-hidden="true">→</span></Link>
          </div>
          {loading ? (
            <p className="overview-state">Loading featured products…</p>
          ) : error ? (
            <p className="overview-state overview-state-error" role="alert">{error}</p>
          ) : visibleProducts.length === 0 ? (
            <div className="overview-state overview-empty-state">
              <p>No products are available yet.</p>
              <Link to="/products">Browse the catalog</Link>
            </div>
          ) : (
            <div className="overview-product-grid">
              {visibleProducts.map((product, index) => (
                <article className="overview-product-card" key={product.id ?? product._id ?? product.name}>
                  <Link className="overview-product-image" to={`/products/${product.id ?? product._id}`} aria-label={`View ${product.name}`}>
                    <img src={product.image || product.imageUrl || productImages[index % productImages.length]} alt={product.name} loading="lazy" />
                  </Link>
                  <div className="overview-product-copy">
                    <p>{product.category || 'Electronics'}</p>
                    <h3><Link to={`/products/${product.id ?? product._id}`}>{product.name}</Link></h3>
                    <span>{formatPrice(product.price)}</span>
                    {product.description && <small>{product.description}</small>}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

export default Dashboard
