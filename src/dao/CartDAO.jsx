const CART_STORAGE_KEY = 'cart'

const readCart = () => {
  const savedCart = localStorage.getItem(CART_STORAGE_KEY)
  if (!savedCart) return []

  let cart
  try {
    cart = JSON.parse(savedCart)
  } catch (error) {
    throw new Error('Saved cart data is invalid. Clear browser storage and try again.', {
      cause: error
    })
  }

  if (!Array.isArray(cart)) {
    throw new Error('Saved cart data has an invalid format.')
  }
  return cart
}

const saveCart = (cart) => {
  if (!Array.isArray(cart)) throw new TypeError('Cart must be an array')
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  return cart
}

const CartDAO = {
  getAll() {
    return readCart()
  },

  getItemCount() {
    return readCart().reduce((count, item) => count + Number(item.quantity || 1), 0)
  },

  add(product, quantity = 1) {
    if (!product || !Number.isInteger(Number(product.id)) || Number(product.id) < 1) {
      throw new TypeError('A valid product is required to add an item to the cart')
    }
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      throw new RangeError('Cart quantity must be between 1 and 99')
    }

    const cart = readCart()
    const existingItem = cart.find((item) => Number(item.id) === Number(product.id))
    if (existingItem) {
      const updatedQuantity = Number(existingItem.quantity || 1) + quantity
      if (updatedQuantity > 99) throw new RangeError('Maximum quantity per product is 99')
      return saveCart(cart.map((item) => (
        Number(item.id) === Number(product.id)
          ? { ...item, quantity: updatedQuantity }
          : item
      )))
    }
    return saveCart([...cart, { ...product, quantity }])
  },

  remove(productId) {
    const id = Number(productId)
    if (!Number.isInteger(id) || id < 1) throw new TypeError('A valid product ID is required')
    return saveCart(readCart().filter((item) => Number(item.id) !== id))
  },

  clear() {
    return saveCart([])
  }
}

export default CartDAO
