import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { apiRequest } from '../services/api.js'

const ProductDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [message, setMessage] = useState('')
  const [isWishlisted, setIsWishlisted] = useState(false)

  useEffect(() => {
    let active = true

    apiRequest(`/products/${id}`)
      .then((data) => {
        if (active) {
          setProduct(data.data)
        }
      })
      .catch((error) => {
        console.log('Error fetching product:', error)
        if (active) {
          setMessage(error.message)
        }
      })

    if (localStorage.getItem('authToken')) {
      apiRequest('/wishlist')
        .then((result) => {
          if (active) {
            setIsWishlisted(
              result.data.some((savedProduct) => String(savedProduct.id) === id)
            )
          }
        })
        .catch((error) => {
          if (active) {
            console.error('Could not load wishlist status:', error)
          }
        })
    }

    return () => {
      active = false
    }
  }, [id])

  const toggleWishlist = async () => {
    if (!localStorage.getItem('authToken')) {
      navigate('/login')
      return
    }

    try {
      if (isWishlisted) {
        await apiRequest(`/wishlist/${product.id}`, { method: 'DELETE' })
        setIsWishlisted(false)
        setMessage('Removed from your wishlist.')
      } else {
        await apiRequest('/wishlist', {
          method: 'POST',
          body: JSON.stringify({ productId: product.id })
        })
        setIsWishlisted(true)
        setMessage('Saved to your wishlist.')
      }
      window.dispatchEvent(new Event('wishlistchange'))
    } catch (error) {
      setMessage(error.message)
    }
  }

  const handleAddToCart = () => {
    if (!localStorage.getItem('authToken')) {
      navigate('/login')
      return
    }

    try {
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]')
      const alreadyInCart = existingCart.some(
        (item) => item.id === product.id
      )

      if (alreadyInCart) {
        setMessage('Product is already in cart')
        return
      }

      localStorage.setItem(
        'cart',
        JSON.stringify([...existingCart, product])
      )
      setMessage('Product added to cart!')
    } catch (error) {
      console.error('Error saving shopping cart:', error)
      setMessage('Could not update your cart. Please try again.')
    }
  }

  return (
    <div className="product-details-container">
      <Link className="text-link" to="/shop">← Back to Shop</Link>
      <h1>Online Shopping Mart</h1>

      <h2>Product Details</h2>

      {product ? (
        <div className="product-details-card">
          <h3>{product.name}</h3>

          <p className="details-price">
            Price: ₹{product.price}
          </p>

          <p className="details-description">
            Description: {product.description}
          </p>

          <button
            className="add-cart-button"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
          <button
            className="wishlist-toggle"
            aria-pressed={isWishlisted}
            onClick={toggleWishlist}
          >
            {isWishlisted ? '♥ Saved to Wishlist' : '♡ Save to Wishlist'}
          </button>
          {message && <p role="status">{message}</p>}
        </div>
      ) : (
        <p className="details-message">
          {message || 'Loading product...'}
        </p>
      )}
    </div>
  )
}

export default ProductDetails