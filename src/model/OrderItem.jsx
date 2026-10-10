export default class OrderItem {
  constructor({ id = null, productId = null, name = '', price = 0, quantity = 1 } = {}) {
    const numericPrice = Number(price)
    const numericQuantity = Number(quantity)
    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      throw new TypeError('Order item price must be a non-negative number')
    }
    if (!Number.isInteger(numericQuantity) || numericQuantity < 1 || numericQuantity > 99) {
      throw new RangeError('Order item quantity must be an integer between 1 and 99')
    }

    this.id = id === null ? null : Number(id)
    this.productId = productId === null ? this.id : Number(productId)
    this.name = String(name).trim()
    this.price = numericPrice
    this.quantity = numericQuantity
  }

  get lineTotal() {
    return this.price * this.quantity
  }
}
