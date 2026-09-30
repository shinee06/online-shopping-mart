import { useState, useEffect } from 'react'

const Cart = () => {
  const [cart, setCart] = useState([])

  useEffect(() => {
    try {
      const data = localStorage.getItem('cart')

      if (data) {
        const savedCart = JSON.parse(data)
        setCart(savedCart)
      }
    } catch (error) {
      console.log('Error reading cart:', error)
      setCart([])
    }
  }, [])

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
        </div>
      )}
    </div>
  )
}

export default Cart