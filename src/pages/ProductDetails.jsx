import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const ProductDetails = () => {
  const { id } = useParams()

  const [product, setProduct] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch(`http://localhost:5000/products/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          setProduct(data.data)
        } else {
          setMessage(data.message)
        }
      })
      .catch((error) => {
        console.log('Error fetching product:', error)
        setMessage('Error fetching product')
      })
  }, [id])
const handleAddToCart = () => {
  const existingCart =
    JSON.parse(localStorage.getItem('cart')) || []

  const alreadyInCart = existingCart.some(
    (item) => item.id === product.id
  )

  if (alreadyInCart) {
    setMessage('Product is already in cart')
    return
  }

  const updatedCart = [...existingCart, product]

  localStorage.setItem(
    'cart',
    JSON.stringify(updatedCart)
  )

  setMessage('Product added to cart!')
}
  return (
    <div className="product-details-container">
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