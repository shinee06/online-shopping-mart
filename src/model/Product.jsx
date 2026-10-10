export default class Product {
  constructor({ id = null, name = '', price = 0, description = '', category = '', image = '' } = {}) {
    const numericPrice = Number(price)
    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      throw new TypeError('Product price must be a non-negative number')
    }

    this.id = id === null ? null : Number(id)
    this.name = String(name).trim()
    this.price = numericPrice
    this.description = String(description)
    this.category = String(category)
    this.image = String(image)
  }

  toJSON() {
    return {
      ...(this.id === null ? {} : { id: this.id }),
      name: this.name,
      price: this.price,
      description: this.description,
      ...(this.category ? { category: this.category } : {}),
      ...(this.image ? { image: this.image } : {})
    }
  }
}
