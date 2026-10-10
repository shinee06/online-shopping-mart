import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { apiRequest } from '../services/api.js'
import CartService from '../services/CartService.jsx'

const categories = [
  { name: 'Laptops', icon: '▱', keywords: ['laptop', 'notebook'], subtitle: 'Work, study and play' },
  { name: 'Mobiles', icon: '▯', keywords: ['mobile', 'phone', 'smartphone'], subtitle: 'Stay connected' },
  { name: 'Headphones', icon: '◖', keywords: ['headphone', 'earbud', 'speaker', 'audio'], subtitle: 'Feel the sound' },
  { name: 'Smartwatches', icon: '◷', keywords: ['watch'], subtitle: 'Track your day' },
  { name: 'Cameras', icon: '▣', keywords: ['camera'], subtitle: 'Capture moments' },
  { name: 'Accessories', icon: '⌁', keywords: ['accessory', 'charger', 'cable'], subtitle: 'Small things, big impact' }
]

const fallbackImages = [
  'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=900&q=85'
]

const getImage = (product, index) => {
  if (product.image || product.imageUrl || product.thumbnail) return product.image || product.imageUrl || product.thumbnail
  const text = `${product.name || ''} ${product.category || ''}`.toLowerCase()
  const categoryIndex = categories.findIndex((category) => category.keywords.some((word) => text.includes(word)))
  return fallbackImages[(categoryIndex >= 0 ? categoryIndex : index) % fallbackImages.length]
}

const formatPrice = (price) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
}).format(Number(price) || 0)

const getMobileBrand = (product) => {
  const name = String(product.name || '').toLowerCase()
  const brands = ['apple', 'samsung', 'oneplus', 'redmi', 'realme', 'vivo', 'iqoo', 'nothing', 'google', 'motorola', 'oppo', 'xiaomi', 'nokia']
  return brands.find((brand) => name.includes(brand)) || 'Other'
}

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const search = searchParams.get('search') || ''
  const [priceFilter, setPriceFilter] = useState('all')
  const activeCategory = searchParams.get('category') || ''
  const activeBrand = searchParams.get('brand') || 'All'
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const updateQuery = (key, value) => {
    const nextParams = new URLSearchParams(searchParams)
    if (value) nextParams.set(key, value)
    else nextParams.delete(key)
    if (key === 'category') nextParams.delete('brand')
    setSearchParams(nextParams, { replace: true })
  }

  const addToCart = (product) => {
    try {
      CartService.add(product)
      window.dispatchEvent(new Event('cartchange'))
      setNotice(`${product.name} added to your cart.`)
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  useEffect(() => {
    let active = true
    apiRequest('/products')
      .then((result) => { if (active) setProducts(Array.isArray(result.data) ? result.data : []) })
      .catch((requestError) => { if (active) setError(requestError.message) })
      .catch((requestError) => { if (active) setError(requestError.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const filteredProducts = useMemo(() => products.filter((product) => {
    const name = `${product.name || ''} ${product.description || ''} ${product.category || ''}`.toLowerCase()
    const matchesSearch = name.includes(search.toLowerCase().trim())
    const matchesPrice = priceFilter === 'all' ||
      (priceFilter === 'below5000' && Number(product.price) < 5000) ||
      (priceFilter === '5000to20000' && Number(product.price) >= 5000 && Number(product.price) <= 20000) ||
      (priceFilter === 'above20000' && Number(product.price) > 20000)
    const category = categories.find((item) => item.name.toLowerCase() === activeCategory.toLowerCase())
    const matchesCategory = !category || category.keywords.some((word) => name.includes(word))
    const matchesBrand = activeCategory.toLowerCase() !== 'mobiles' || activeBrand === 'All' || getMobileBrand(product) === activeBrand.toLowerCase()
    return matchesSearch && matchesPrice && matchesCategory && matchesBrand
  }), [activeBrand, activeCategory, priceFilter, products, search])

  const mobileBrands = ['All', ...new Set(products
    .filter((product) => categories.find((item) => item.name === 'Mobiles')?.keywords.some((word) => `${product.name || ''} ${product.category || ''}`.toLowerCase().includes(word)))
    .map(getMobileBrand))]

  return (
    <main className="products-page">
      <div className="products-storefront">
        <section className="products-hero">
          <div>
            {activeCategory ? <span className="products-breadcrumb"><Link to="/dashboard">Home</Link><span aria-hidden="true">›</span>{activeCategory}</span> : <span className="products-eyebrow">ONLINE SHOPPING MART</span>}
            <h1>{activeCategory.toLowerCase() === 'mobiles' ? 'Mobile Phones Collection' : activeCategory ? `${activeCategory} Collection` : 'Find your next favorite'}</h1>
            <p>{activeCategory.toLowerCase() === 'mobiles' ? 'Latest smartphones from top brands. Find the right phone for you.' : activeCategory ? `Explore our ${activeCategory.toLowerCase()} collection.` : 'Latest gadgets. Better prices. Unbeatable deals.'}</p>
            {!activeCategory && <a className="products-hero-link" href="#featured-products">Shop now <span aria-hidden="true">→</span></a>}
          </div>
          <img src={activeCategory.toLowerCase() === 'mobiles' ? fallbackImages[1] : 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=850&q=85'} alt={activeCategory.toLowerCase() === 'mobiles' ? 'Smartphones' : 'Laptops and electronics'} />
        </section>

        {!activeCategory && <section className="products-category-section" aria-labelledby="category-title">
          <div className="products-section-heading">
            <h2 id="category-title"><span aria-hidden="true">▣</span> Shop by Category</h2>
          </div>
          <div className="products-category-grid">
            {categories.map((category, index) => (
              <button className={`products-category-card category-tone-${index}`} type="button" key={category.name} onClick={() => updateQuery('category', category.name)}>
                <span className="products-category-icon" aria-hidden="true">{category.icon}</span>
                <strong>{category.name}</strong>
                <small>{category.subtitle}</small>
              </button>
            ))}
          </div>
        </section>}

        {activeCategory.toLowerCase() === 'mobiles' && <nav className="mobile-brand-filters" aria-label="Filter mobile phones by brand">
          {mobileBrands.map((brand) => <button className={activeBrand === brand ? 'selected' : ''} type="button" key={brand} onClick={() => updateQuery('brand', brand === 'All' ? '' : brand)}>{brand === 'All' ? brand : `${brand[0].toUpperCase()}${brand.slice(1)}`}</button>)}
        </nav>}

        <section className="products-featured-section" id="featured-products" aria-labelledby="featured-products-title">
          <div className="products-section-heading">
            <h2 id="featured-products-title"><span aria-hidden="true">☆</span> {activeCategory ? `${activeCategory} Collection` : 'Featured Products'}</h2>
            {activeCategory && <button type="button" onClick={() => updateQuery('category', '')}>Clear category</button>}
            <span className="products-result-count">{filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}</span>
          </div>
          <div className="products-filters">
            <label className="products-inline-search">
              <span className="sr-only">Search products</span>
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></svg>
              <input type="search" placeholder={activeCategory.toLowerCase() === 'mobiles' ? 'Search mobile phones' : 'Search products'} value={search} onChange={(event) => updateQuery('search', event.target.value.trim())} />
            </label>
            <select aria-label="Filter by price" value={priceFilter} onChange={(event) => setPriceFilter(event.target.value)}>
              <option value="all">All prices</option>
              <option value="below5000">Under ₹5,000</option>
              <option value="5000to20000">₹5,000–₹20,000</option>
              <option value="above20000">Above ₹20,000</option>
            </select>
          </div>

          {notice && <p className="products-message products-success" role="status">{notice}</p>}

          {loading ? <p className="products-message">Loading products…</p>
            : error ? <p className="products-message products-error" role="alert">{error}</p>
              : filteredProducts.length === 0 ? <p className="products-message">No products match your search. Try another category or search term.</p>
                : <div className="store-product-grid">
                  {filteredProducts.map((product, index) => (
                    <article className="store-product-card" key={product.id ?? product._id ?? product.name}>
                      <Link className="store-product-photo" to={`/products/${product.id ?? product._id}`} aria-label={`View ${product.name}`}>
                        <img src={getImage(product, index)} alt={product.name} loading="lazy" />
                      </Link>
                      <div className="store-product-info">
                        <span className="store-product-category">{product.category || 'Electronics'}</span>
                        <h3><Link to={`/products/${product.id ?? product._id}`}>{product.name}</Link></h3>
                        <div className="store-product-rating" aria-label="Customer rating">★ <span>Popular pick</span></div>
                        <strong>{formatPrice(product.price)}</strong>
                        <Link className="store-product-button" to={`/products/${product.id ?? product._id}`}>View details</Link>
                        <button className="store-wishlist-button" type="button" onClick={() => addToCart(product)}>Add to Cart</button>
                      </div>
                    </article>
                  ))}
                </div>}
        </section>
      </div>
    </main>
  )
}

export default Products
