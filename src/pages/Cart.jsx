import { useState } from 'react'
import { Link } from 'react-router-dom'

const Cart = () => {
  const [cart, setCart] = useState(() => {
    try {
      const data = localStorage.getItem('cart')
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.log('Error reading cart:', error)
      return []
    }
  })

  const removeProduct = (id) => {
    const updatedCart = cart.filter(
      (product) => product.id !== id
    )

    setCart(updatedCart)

    localStorage.setItem(
      'cart',
      JSON.stringify(updatedCart)
    )
  }

  return (
    <div>
      <h1>Shopping Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cart.map((product) => (
            <div key={product.id}>
              <h2>{product.name}</h2>

              <p>Price: ₹{product.price}</p>

              <p>{product.description}</p>

              <button
                onClick={() => removeProduct(product.id)}
              >
                Remove
              </button>

              <hr />
            </div>
          ))}

          <Link to="/checkout">
            <button>Proceed to Checkout</button>
          </Link>
        </div>
      )}
    </div>
  )
}

export default Cart