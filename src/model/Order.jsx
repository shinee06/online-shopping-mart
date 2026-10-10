import OrderItem from './OrderItem.jsx'

export default class Order {
  constructor({
    id = null,
    customer = {},
    items = [],
    subtotal = 0,
    shipping = 0,
    total,
    createdAt = null
  } = {}) {
    if (!Array.isArray(items)) throw new TypeError('Order items must be an array')
    this.id = id === null ? null : Number(id)
    this.customer = { ...customer }
    this.items = items.map((item) => item instanceof OrderItem ? item : new OrderItem(item))
    this.subtotal = Number(subtotal)
    this.shipping = Number(shipping)
    this.total = total === undefined ? this.subtotal + this.shipping : Number(total)
    this.createdAt = createdAt

    if (![this.subtotal, this.shipping, this.total].every((amount) => Number.isFinite(amount) && amount >= 0)) {
      throw new TypeError('Order totals must be non-negative numbers')
    }
  }
}
