import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import CartService from '../services/CartService.jsx'

const CartContext = createContext(null)

const getInitialCart = () => {
  if (typeof window === 'undefined') return []

  try {
    return CartService.getAll()
  } catch (error) {
    console.error('Unable to load the saved cart:', error)
    return []
  }
}

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(getInitialCart)

  // Keep other tabs in sync when they update the same saved cart.
  useEffect(() => {
    const syncCart = (event) => {
      if (event.key !== 'cart') return
      try {
        setItems(event.newValue ? JSON.parse(event.newValue) : [])
      } catch (error) {
        console.error('Unable to sync the saved cart:', error)
        setItems([])
      }
    }

    window.addEventListener('storage', syncCart)
    return () => window.removeEventListener('storage', syncCart)
  }, [])

  const addToCart = useCallback((product, quantity = 1) => {
    const nextItems = CartService.add(product, quantity)
    setItems(nextItems)
    return nextItems
  }, [])

  const removeFromCart = useCallback((productId) => {
    const nextItems = CartService.remove(productId)
    setItems(nextItems)
    return nextItems
  }, [])

  const clearCart = useCallback(() => {
    const nextItems = CartService.clear()
    setItems(nextItems)
    return nextItems
  }, [])

  const value = useMemo(() => {
    const itemCount = items.reduce((count, item) => count + Number(item.quantity || 1), 0)
    const subtotal = items.reduce(
      (sum, item) => sum + (Number(item.price) || 0) * Number(item.quantity || 1),
      0
    )

    return { items, itemCount, subtotal, addToCart, removeFromCart, clearCart }
  }, [items, addToCart, removeFromCart, clearCart])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// The hook belongs beside its provider so consumers import both from one module.
// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used inside a CartProvider')
  }
  return context
}

export default CartProvider
