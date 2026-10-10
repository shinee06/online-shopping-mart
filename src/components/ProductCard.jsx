import { Link } from 'react-router-dom'

const formatPrice = (price, currency = 'INR') => {
  const amount = Number(price)
  if (!Number.isFinite(amount)) return 'Price unavailable'

  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2
    }).format(amount)
  } catch {
    return `${currency} ${amount.toFixed(2)}`
  }
}

const ProductCard = ({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
  detailsPath,
  className = ''
}) => {
  if (!product) return null

  const id = product.id ?? product._id
  const name = product.name || 'Untitled product'
  const image = product.image || product.imageUrl || product.thumbnail
  const path = detailsPath || `/shop/products/${id}`

  return (
    <article className={`product-card ${className}`.trim()}>
      <Link className="product-card-image-link" to={path} aria-label={`View ${name}`}>
        {image ? (
          <img className="product-card-image" src={image} alt={name} loading="lazy" />
        ) : (
          <div className="product-card-image product-card-image-placeholder" aria-hidden="true">No image</div>
        )}
      </Link>
      <div className="product-card-content">
        {product.category && <p className="product-card-category">{product.category}</p>}
        <h3><Link to={path}>{name}</Link></h3>
        <p className="product-price">{formatPrice(product.price, product.currency)}</p>
        {product.description && <p className="product-card-description">{product.description}</p>}
        <div className="product-card-actions">
          <Link className="product-card-details" to={path}>View details</Link>
          {onAddToCart && (
            <button type="button" onClick={() => onAddToCart(product)}>Add to cart</button>
          )}
          {onToggleWishlist && (
            <button
              type="button"
              aria-pressed={isWishlisted}
              aria-label={isWishlisted ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`}
              onClick={() => onToggleWishlist(product)}
            >
              {isWishlisted ? '♥ Saved' : '♡ Wishlist'}
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

export default ProductCard
