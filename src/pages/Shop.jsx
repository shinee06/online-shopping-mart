import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { apiRequest } from '../services/api.js'
import CategoryIcon from '../components/CategoryIcon.jsx'

const categories = [
  { name: 'Laptops', icon: 'laptop', words: ['laptop', 'notebook'] },
  { name: 'Mobiles', icon: 'mobile', words: ['mobile', 'phone', 'smartphone'] },
  { name: 'Headphones', icon: 'headphones', words: ['headphone', 'earbud', 'speaker', 'audio'] },
  { name: 'Smartwatches', icon: 'watch', words: ['watch'] },
  { name: 'Cameras', icon: 'camera', words: ['camera'] },
  { name: 'Televisions', icon: 'television', words: ['television', 'smart tv', ' tv'] },
  { name: 'Accessories', icon: 'accessories', words: ['accessory', 'charger', 'cable', 'keyboard', 'mouse', 'power bank'] }
]
const productImages = [
  'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=85'
]

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const search = searchParams.get('search') || ''
  const [wishlistIds, setWishlistIds] = useState([])
  const [activeCategory, setActiveCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [wishlistError, setWishlistError] = useState('')

  useEffect(() => {
    let active = true
    apiRequest('/products')
      .then((result) => { if (active) setProducts(Array.isArray(result.data) ? result.data : []) })
      .catch((requestError) => { if (active) setError(requestError.message) })
      .finally(() => { if (active) setLoading(false) })
    apiRequest('/wishlist')
      .then((result) => { if (active) setWishlistIds(result.data.map((product) => product.id)) })
      .catch((requestError) => { if (active) setWishlistError(requestError.message) })
    return () => { active = false }
  }, [])

  const filteredProducts = useMemo(() => products.filter((product) => {
    const text = `${product.name || ''} ${product.description || ''} ${product.category || ''}`.toLowerCase()
    const category = categories.find((item) => item.name === activeCategory)
    const matchesCategory = !activeCategory || (product.category
      ? product.category.trim().toLowerCase() === activeCategory.trim().toLowerCase()
      : category.words.some((word) => text.includes(word)))
    return text.includes(search.trim().toLowerCase()) && matchesCategory
  }), [activeCategory, products, search])

  const handleSearchChange = (value) => {
    const query = value.trim()
    setSearchParams(query ? { search: query } : {}, { replace: true })
  }

  const toggleWishlist = async (productId) => {
    setWishlistError('')
    try {
      if (wishlistIds.includes(productId)) {
        await apiRequest(`/wishlist/${productId}`, { method: 'DELETE' })
        setWishlistIds((ids) => ids.filter((id) => id !== productId))
      } else {
        await apiRequest('/wishlist', { method: 'POST', body: JSON.stringify({ productId }) })
        setWishlistIds((ids) => [...ids, productId])
      }
      window.dispatchEvent(new Event('wishlistchange'))
    } catch (requestError) {
      setWishlistError(requestError.message)
    }
  }

  return (
    <main className="products-page">
      <div className="products-storefront">
        <section className="products-hero">
          <div><span className="products-eyebrow">SHINEEMART STORE</span><h1>Find your next favorite</h1><p>Latest gadgets. Better prices. Unbeatable deals.</p><a className="products-hero-link" href="#shop-products">Shop now <span aria-hidden="true">→</span></a></div>
          <img src="https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=850&q=85" alt="Laptops and electronics" />
        </section>

        <section className="products-category-section" aria-label="Shop by category">
          <div className="products-section-heading"><h2><span aria-hidden="true">▣</span> Shop by Category</h2>{activeCategory && <button type="button" onClick={() => setActiveCategory('')}>Clear category</button>}</div>
          <div className="products-category-grid">
            {categories.map((category, index) => <button className={`products-category-card category-tone-${index}${activeCategory === category.name ? ' selected' : ''}`} type="button" key={category.name} onClick={() => setActiveCategory((current) => current === category.name ? '' : category.name)}><span className="products-category-icon"><CategoryIcon name={category.icon} /></span><strong>{category.name}</strong><small>Explore {category.name.toLowerCase()}</small></button>)}
          </div>
        </section>

        <section className="products-featured-section" id="shop-products" aria-labelledby="shop-products-title">
          <div className="products-section-heading"><h2 id="shop-products-title"><span aria-hidden="true">☆</span> {activeCategory || 'Featured Products'}</h2><span className="products-result-count">{filteredProducts.length} products</span></div>
          <div className="products-filters">
            <label className="products-inline-search"><span className="sr-only">Search products</span><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></svg><input type="search" placeholder="Search products" value={search} onChange={(event) => handleSearchChange(event.target.value)} /></label>
          </div>
          {wishlistError && <p className="products-message products-error" role="alert">{wishlistError}</p>}
          {loading ? <p className="products-message">Loading products…</p>
            : error ? <p className="products-message products-error" role="alert">{error}</p>
              : filteredProducts.length === 0 ? <p className="products-message">No products match your search. Try a different term or category.</p>
                : <div className="store-product-grid">
                  {filteredProducts.map((product, index) => {
                    const productId = product.id ?? product._id
                    const text = `${product.name || ''} ${product.category || ''}`.toLowerCase()
                    const categoryIndex = categories.findIndex((item) => item.words.some((word) => text.includes(word)))
                    const image = product.image || product.imageUrl || product.thumbnail || productImages[(categoryIndex >= 0 ? categoryIndex : index) % productImages.length]
                    const price = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(product.price) || 0)
                    const saved = wishlistIds.includes(productId)
                    return <article className="store-product-card" key={productId}>
                      <Link className="store-product-photo" to={`/shop/products/${productId}`} aria-label={`View ${product.name}`}><img src={image} alt={product.name} loading="lazy" /></Link>
                      <div className="store-product-info"><span className="store-product-category">{product.category || 'Electronics'}</span><h3><Link to={`/shop/products/${productId}`}>{product.name}</Link></h3><div className="store-product-rating">★ <span>Popular pick</span></div><strong>{price}</strong><Link className="store-product-button" to={`/shop/products/${productId}`}>View details</Link><button type="button" className="store-wishlist-button" aria-pressed={saved} onClick={() => toggleWishlist(productId)}>{saved ? '♥ Saved to wishlist' : '♡ Add to wishlist'}</button></div>
                    </article>
                  })}
                </div>}
        </section>
      </div>
    </main>
  )
}

export default Shop
