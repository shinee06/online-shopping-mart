import Product from './Product.jsx'

export default class CartItem extends Product {
  constructor(product = {}, quantity = 1) {
    super(product)
    const parsedQuantity = Number(quantity)
    if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1 || parsedQuantity > 99) {
      throw new RangeError('Cart quantity must be an integer between 1 and 99')
    }
    this.quantity = parsedQuantity
  }

  get lineTotal() {
    return this.price * this.quantity
  }

  toJSON() {
    return { ...super.toJSON(), quantity: this.quantity }
  }
}
