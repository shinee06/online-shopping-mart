import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest } from '../services/api.js'
import CartService from '../services/CartService.jsx'

const recommendationImages = [
  'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=700&q=85',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=85',
  'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=700&q=85',
  'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=700&q=85',
  'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=700&q=85',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=85'
]

const imageFor = (product, index) => {
  if (product.image || product.imageUrl || product.thumbnail) return product.image || product.imageUrl || product.thumbnail
  const name = String(product.name || '').toLowerCase()
  if (name.includes('keyboard')) return 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=700&q=85'
  if (name.includes('mouse')) return recommendationImages[0]
  if (name.includes('headphone') || name.includes('earbud')) return recommendationImages[1]
  if (name.includes('camera')) return recommendationImages[3]
  if (name.includes('laptop')) return recommendationImages[4]
  if (name.includes('watch')) return recommendationImages[5]
  return recommendationImages[index % recommendationImages.length]
}
const formatPrice = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(amount) || 0)

const Cart = () => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('cart')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [products, setProducts] = useState([])
  const [wishlistIds, setWishlistIds] = useState([])
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    let active = true
    apiRequest('/products').then((result) => {
      if (active) setProducts(Array.isArray(result.data) ? result.data : [])
    }).catch(() => {})
    apiRequest('/wishlist').then((result) => {
      if (active) setWishlistIds(result.data.map((product) => Number(product.id)))
    }).catch(() => {})
    return () => { active = false }
  }, [])

  const subtotal = useMemo(() => cart.reduce(
    (sum, product) => sum + (Number(product.price) || 0) * Number(product.quantity || 1), 0
  ), [cart])
  const totalQuantity = useMemo(() => cart.reduce((sum, product) => sum + Number(product.quantity || 1), 0), [cart])
  const shipping = cart.length ? 200 : 0
  const total = subtotal + shipping
  const recommendations = useMemo(() => {
    const inCart = new Set(cart.map((product) => Number(product.id)))
    return products.filter((product) => !inCart.has(Number(product.id))).slice(0, 4)
  }, [cart, products])

  const syncCart = (nextCart, message = '') => {
    setCart(nextCart)
    window.dispatchEvent(new Event('cartchange'))
    setNotice(message)
  }

  const changeQuantity = (product, amount) => {
    setError('')
    setNotice('')
    const currentQuantity = Number(product.quantity || 1)
    const nextQuantity = currentQuantity + amount
    if (nextQuantity > 99) {
      setError('You can add up to 99 of the same product.')
      return
    }
    try {
      CartService.remove(product.id)
      const nextCart = nextQuantity > 0 ? CartService.add(product, nextQuantity) : CartService.getAll()
      syncCart(nextCart)
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const removeProduct = (product) => {
    try {
      const nextCart = CartService.remove(product.id)
      syncCart(nextCart, `${product.name} removed from your cart.`)
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const addProduct = (product) => {
    try {
      const nextCart = CartService.add(product)
      syncCart(nextCart, `${product.name} added to your cart.`)
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const toggleWishlist = async (product) => {
    const id = Number(product.id)
    setError('')
    try {
      if (wishlistIds.includes(id)) {
        await apiRequest(`/wishlist/${id}`, { method: 'DELETE' })
        setWishlistIds((current) => current.filter((savedId) => savedId !== id))
        setNotice(`${product.name} removed from your wishlist.`)
      } else {
        await apiRequest('/wishlist', { method: 'POST', body: JSON.stringify({ productId: id }) })
        setWishlistIds((current) => [...current, id])
        setNotice(`${product.name} saved to your wishlist.`)
      }
      window.dispatchEvent(new Event('wishlistchange'))
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <main className="cart-store-page">
      <div className="cart-store-content">
        <header className="cart-page-hero">
          <span className="cart-hero-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h8.4a2 2 0 0 0 1.9-1.4L21 8H6" /><circle cx="10" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></svg>
          </span>
          <div><span className="cart-page-eyebrow">YOUR SELECTION</span><h1>My Cart</h1><p>Review your items and proceed to checkout.</p></div>
          <div className="cart-hero-decoration" aria-hidden="true">Better<br />Tech<br />Dreams</div>
        </header>

        {error && <p className="cart-feedback cart-feedback-error" role="alert">{error}</p>}
        {notice && <p className="cart-feedback" role="status">{notice}</p>}

        {cart.length === 0 ? (
          <section className="cart-empty-panel">
            <span aria-hidden="true">🛒</span><h2>Your cart is empty</h2><p>Browse the store and add something you love.</p>
            <Link className="cart-continue-link" to="/shop">Continue shopping</Link>
          </section>
        ) : (
          <div className="cart-store-layout">
            <div className="cart-main-column">
              <section className="cart-items-panel" aria-label="Cart items">
                <h2>{totalQuantity} {totalQuantity === 1 ? 'item' : 'items'} in your cart</h2>
                {cart.map((product, index) => (
                  <article className="cart-store-item" key={product.id}>
                    <Link className="cart-store-image" to={`/shop/products/${product.id}`} aria-label={`View ${product.name}`}><img src={imageFor(product, index)} alt={product.name} /></Link>
                    <div className="cart-store-product-copy">
                      <h3><Link to={`/shop/products/${product.id}`}>{product.name}</Link></h3>
                      <p>{product.description || 'Ready to ship'}</p>
                      <strong>{formatPrice(product.price)}</strong>
                    </div>
                    <div className="cart-quantity-control" aria-label={`Quantity for ${product.name}`}>
                      <button type="button" aria-label={`Decrease ${product.name} quantity`} onClick={() => changeQuantity(product, -1)}>−</button>
                      <span>{Number(product.quantity || 1)}</span>
                      <button type="button" aria-label={`Increase ${product.name} quantity`} onClick={() => changeQuantity(product, 1)}>+</button>
                    </div>
                    <strong className="cart-line-total">{formatPrice(Number(product.price) * Number(product.quantity || 1))}</strong>
                    <div className="cart-item-actions">
                      <button className={`cart-heart-button${wishlistIds.includes(Number(product.id)) ? ' is-saved' : ''}`} type="button" aria-label={wishlistIds.includes(Number(product.id)) ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`} aria-pressed={wishlistIds.includes(Number(product.id))} onClick={() => toggleWishlist(product)}>{wishlistIds.includes(Number(product.id)) ? '♥' : '♡'}</button>
                      <button className="cart-trash-button" type="button" aria-label={`Remove ${product.name} from cart`} onClick={() => removeProduct(product)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3" /></svg></button>
                    </div>
                  </article>
                ))}
                <Link className="cart-continue-link" to="/shop"><span aria-hidden="true">←</span> Continue shopping</Link>
              </section>

              {recommendations.length > 0 && (
                <section className="cart-recommendations">
                  <div className="cart-recommendation-heading"><h2><span aria-hidden="true">✦</span> You may also like</h2><Link to="/shop">View more <span aria-hidden="true">→</span></Link></div>
                  <div className="cart-recommendation-grid">
                    {recommendations.map((product, index) => (
                      <article className="cart-recommendation-card" key={product.id}>
                        <Link to={`/shop/products/${product.id}`} className="cart-recommendation-image"><img src={imageFor(product, index + 1)} alt={product.name} loading="lazy" /></Link>
                        <h3><Link to={`/shop/products/${product.id}`}>{product.name}</Link></h3>
                        <strong>{formatPrice(product.price)}</strong>
                        <button type="button" onClick={() => addProduct(product)}><span aria-hidden="true">＋</span> Add to Cart</button>
                      </article>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <aside className="cart-summary-panel" aria-label="Order summary">
              <h2>Order Summary</h2>
              <div className="cart-summary-line"><span>Subtotal ({totalQuantity} {totalQuantity === 1 ? 'item' : 'items'})</span><strong>{formatPrice(subtotal)}</strong></div>
              <div className="cart-summary-line"><span>Delivery fee</span><strong>{formatPrice(shipping)}</strong></div>
              <div className="cart-summary-total"><span>Total amount</span><strong>{formatPrice(total)}</strong></div>
              <Link className="cart-checkout-button" to="/checkout"><span aria-hidden="true">♙</span> Proceed to Checkout <span aria-hidden="true">→</span></Link>
              <div className="cart-secure-note"><span aria-hidden="true">✓</span><div><strong>Safe &amp; secure checkout</strong><small>Your order details are protected.</small></div></div>
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}

export default Cart
