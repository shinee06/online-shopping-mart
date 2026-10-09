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
    <main className="cart-page">
      <header className="page-heading">
        <span className="page-eyebrow">YOUR SELECTION</span>
        <h1>Shopping Cart</h1>
        <p>Review your items before you check out.</p>
      </header>

      {cart.length === 0 ? (
        <section className="empty-state">
          <p>Your cart is empty.</p>
          <Link className="primary-link" to="/products">Browse Products</Link>
        </section>
      ) : (
        <section className="cart-items">
          {cart.map((product) => (
            <article className="cart-item" key={product.id}>
              <div>
                <h2>{product.name}</h2>
                <p>{product.description}</p>
              </div>
              <strong className="product-price">₹{product.price}</strong>
              <button className="danger-button" onClick={() => removeProduct(product.id)}>
                Remove
              </button>
            </article>
          ))}

          <Link className="primary-link cart-checkout-link" to="/checkout">
            Proceed to Checkout
          </Link>
        </section>
      )}
    </main>
  )
}

export default Cart