export default class Review {
  constructor({ id = null, productId, customerId = null, customerName = '', rating, reviewText = '', createdAt = null } = {}) {
    const numericRating = Number(rating)
    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      throw new RangeError('Review rating must be an integer from 1 to 5')
    }
    if (typeof reviewText !== 'string' || !reviewText.trim() || reviewText.trim().length > 2000) {
      throw new TypeError('Review text is required and must be 2000 characters or fewer')
    }

    this.id = id === null ? null : Number(id)
    this.productId = productId === undefined ? null : Number(productId)
    this.customerId = customerId === null ? null : Number(customerId)
    this.customerName = String(customerName)
    this.rating = numericRating
    this.reviewText = reviewText.trim()
    this.createdAt = createdAt
  }
}
