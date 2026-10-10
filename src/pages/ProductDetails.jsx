import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { apiRequest } from '../services/api.js'
import CartService from '../services/CartService.jsx'

const imageSets = {
  laptop: [
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=90',
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=1000&q=90',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=90'
  ],
  phone: [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=90',
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1000&q=90',
    'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=1000&q=90'
  ],
  audio: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=90',
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=90',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1000&q=90'
  ],
  keyboard: [
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=90',
    'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1000&q=90',
    'https://images.unsplash.com/photo-1595044426077-d36d9236d54a?auto=format&fit=crop&w=1000&q=90'
  ],
  watch: [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=90',
    'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=1000&q=90',
    'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1000&q=90'
  ],
  camera: [
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=90',
    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1000&q=90',
    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1000&q=90'
  ],
  other: [
    'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1000&q=90',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1000&q=90',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=90'
  ]
}

const getProductImages = (product) => {
  if (product.image || product.imageUrl || product.thumbnail) {
    const image = product.image || product.imageUrl || product.thumbnail
    return [image, image, image]
  }
  const name = String(product.name || '').toLowerCase()
  const type = name.includes('laptop') ? 'laptop'
    : name.includes('phone') || name.includes('mobile') ? 'phone'
      : name.includes('headphone') || name.includes('speaker') || name.includes('earbud') ? 'audio'
        : name.includes('keyboard') ? 'keyboard'
        : name.includes('watch') ? 'watch'
          : name.includes('camera') ? 'camera'
            : 'other'
  return imageSets[type]
}

const formatPrice = (price) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
}).format(Number(price) || 0)

const ProductDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [productResult, setProductResult] = useState({ id: '', product: null, error: '' })
  const [feedback, setFeedback] = useState({ id: '', message: '', isError: false })
  const [wishlistState, setWishlistState] = useState({ id: '', value: false })
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const product = productResult.id === id ? productResult.product : null
  const loadError = productResult.id === id ? productResult.error : ''
  const message = feedback.id === id ? feedback.message : ''
  const messageIsError = feedback.id === id && feedback.isError
  const isWishlisted = wishlistState.id === id && wishlistState.value

  useEffect(() => {
    let active = true
    apiRequest(`/products/${id}`)
      .then((result) => { if (active) setProductResult({ id, product: result.data, error: '' }) })
      .catch((requestError) => { if (active) setProductResult({ id, product: null, error: requestError.message }) })
    if (localStorage.getItem('authToken')) {
      apiRequest('/wishlist')
        .then((result) => {
          if (active) setWishlistState({ id, value: result.data.some((saved) => String(saved.id) === id) })
        })
        .catch(() => {})
    }
    return () => { active = false }
  }, [id])

  const images = useMemo(() => product ? getProductImages(product) : [], [product])
  const category = useMemo(() => {
    if (product?.category) return product.category
    const name = String(product?.name || '').toLowerCase()
    if (name.includes('laptop')) return 'Computers'
    if (name.includes('phone') || name.includes('mobile')) return 'Mobile Phones'
    if (name.includes('headphone') || name.includes('speaker') || name.includes('earbud')) return 'Audio'
    if (name.includes('watch')) return 'Wearables'
    if (name.includes('camera')) return 'Cameras'
    return 'Electronics'
  }, [product])
  const highlights = useMemo(() => String(product?.description || '')
    .split(/[.!?;]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 5), [product])
  const backPath = location.pathname.startsWith('/shop/') ? '/shop' : '/products'

  const toggleWishlist = async () => {
    if (!localStorage.getItem('authToken')) {
      navigate('/login')
      return
    }
    try {
      if (isWishlisted) {
        await apiRequest(`/wishlist/${product.id}`, { method: 'DELETE' })
        setWishlistState({ id, value: false })
        setFeedback({ id, message: 'Removed from your wishlist.', isError: false })
      } else {
        await apiRequest('/wishlist', { method: 'POST', body: JSON.stringify({ productId: product.id }) })
        setWishlistState({ id, value: true })
        setFeedback({ id, message: 'Saved to your wishlist.', isError: false })
      }
      window.dispatchEvent(new Event('wishlistchange'))
    } catch (requestError) {
      setFeedback({ id, message: requestError.message, isError: true })
    }
  }

  const handleAddToCart = () => {
    if (!product) return
    if (!localStorage.getItem('authToken')) {
      navigate('/login')
      return
    }
    try {
      CartService.add({ ...product, image: images[selectedImage] }, quantity)
      window.dispatchEvent(new Event('cartchange'))
      setFeedback({ id, message: `${product.name} added to your cart.`, isError: false })
    } catch (requestError) {
      setFeedback({ id, message: requestError.message, isError: true })
    }
  }

  if (!product && !loadError) {
    return <main className="product-detail-page"><div className="product-detail-loading">Loading product details…</div></main>
  }
  if (!product) {
    return <main className="product-detail-page"><section className="product-detail-error"><p role="alert">{loadError || 'This product could not be found.'}</p><Link to={backPath}>Back to products</Link></section></main>
  }

  return (
    <main className="product-detail-page">
      <div className="product-detail-content">
        <nav className="product-breadcrumbs" aria-label="Breadcrumb">
          <Link to="/dashboard" aria-label="Home"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 11 9-8 9 8M5 10v10h14V10M9 20v-6h6v6" /></svg></Link>
          <span aria-hidden="true">›</span><Link to={backPath}>Products</Link><span aria-hidden="true">›</span><span>{product.name}</span>
        </nav>

        <div className="product-detail-layout">
          <div className="product-detail-main-column">
            <section className="product-detail-card">
              <div className="product-gallery">
                <div className="product-main-image"><img src={images[selectedImage]} alt={product.name} /><span className="product-availability">Available</span><button className={`product-image-heart${isWishlisted ? ' saved' : ''}`} type="button" aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'} aria-pressed={isWishlisted} onClick={toggleWishlist}>{isWishlisted ? '♥' : '♡'}</button></div>
                <div className="product-thumbnails" aria-label="Product images">
                  {images.map((image, index) => <button className={selectedImage === index ? 'selected' : ''} type="button" key={`${image}-${index}`} aria-label={`Show product image ${index + 1}`} onClick={() => setSelectedImage(index)}><img src={image} alt="" /></button>)}
                </div>
              </div>

              <div className="product-purchase-info">
                <span className="product-detail-category">{category}</span>
                <h1>{product.name}</h1>
                <p className="product-detail-rating">★ <span>Product details</span></p>
                <strong className="product-detail-price">{formatPrice(product.price)}</strong>
                <p className="product-detail-description">{product.description || 'View the product details and add it to your cart when you are ready.'}</p>

                <div className="product-benefit-row">
                  <div><span aria-hidden="true">✦</span><small>Selected<br />product</small></div>
                  <div><span aria-hidden="true">▦</span><small>Simple<br />checkout</small></div>
                  <div><span aria-hidden="true">✓</span><small>Cart<br />quantity control</small></div>
                </div>

                <div className="product-purchase-actions">
                  <div className="product-detail-quantity" aria-label="Choose quantity">
                    <button type="button" aria-label="Decrease quantity" disabled={quantity <= 1} onClick={() => setQuantity((current) => Math.max(1, current - 1))}>−</button>
                    <span>{quantity}</span>
                    <button type="button" aria-label="Increase quantity" disabled={quantity >= 99} onClick={() => setQuantity((current) => Math.min(99, current + 1))}>+</button>
                  </div>
                  <button className="product-detail-add-button" type="button" onClick={handleAddToCart}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h8.4a2 2 0 0 0 1.9-1.4L21 8H6" /><circle cx="10" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></svg>Add to Cart</button>
                  <button className="product-detail-wishlist-button" type="button" aria-pressed={isWishlisted} onClick={toggleWishlist}>{isWishlisted ? '♥ Saved' : '♡ Add to Wishlist'}</button>
                </div>
                {message && <p className={messageIsError ? 'product-detail-feedback error' : 'product-detail-feedback'} role={messageIsError ? 'alert' : 'status'}>{message}</p>}
                <div className="product-delivery-note"><span aria-hidden="true">↗</span><div><strong>Delivery details at checkout</strong><small>Shipping costs are shown before you place your order.</small></div></div>
              </div>
            </section>

            <section className="product-description-panel">
              <div className="product-detail-tab-bar"><button className="active" type="button">Description</button><button type="button" onClick={() => document.getElementById('product-information')?.scrollIntoView({ behavior: 'smooth' })}>Product information</button></div>
              <div className="product-detail-tab-content"><p>{product.description || 'More information about this product will be available soon.'}</p><div id="product-information"><strong>Product name</strong><span>{product.name}</span><strong>Category</strong><span>{category}</span><strong>Price</strong><span>{formatPrice(product.price)}</span></div></div>
            </section>
          </div>

          <aside className="product-detail-sidebar">
            <section className="product-detail-side-card">
              <h2><span aria-hidden="true">✦</span> Product Highlights</h2>
              {highlights.length ? <ul>{highlights.map((highlight, index) => <li key={`${highlight}-${index}`}><span aria-hidden="true">✓</span>{highlight}</li>)}</ul> : <p>Product information is not available yet.</p>}
            </section>
            <section className="product-detail-side-card seller-card">
              <h2><span aria-hidden="true">▣</span> Store Information</h2>
              <div className="seller-summary"><span aria-hidden="true">S</span><div><strong>ShineeMart Store</strong><small>Product listing</small></div></div>
              <Link to={backPath}>View more products <span aria-hidden="true">→</span></Link>
              <div className="product-origin-note"><span aria-hidden="true">✓</span><div><strong>Product details</strong><small>Check the description for product information.</small></div></div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default ProductDetails
