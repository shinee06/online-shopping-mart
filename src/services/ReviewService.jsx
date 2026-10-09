import { apiRequest } from './api.js'

const ReviewService = {
  async getForProduct(productId) {
    const id = Number(productId)
    if (!Number.isInteger(id) || id < 1) {
      throw new TypeError('Product ID must be a positive integer')
    }

    const response = await apiRequest(`/products/${id}/reviews`)
    return response.data
  },

  async create({ productId, rating, reviewText }) {
    const payload = normalizeReview({ productId, rating, reviewText })
    const response = await apiRequest('/reviews', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
    return response.data
  },

  async update(reviewId, { rating, reviewText }) {
    const id = Number(reviewId)
    if (!Number.isInteger(id) || id < 1) {
      throw new TypeError('Review ID must be a positive integer')
    }

    const payload = normalizeReview({ rating, reviewText })
    const response = await apiRequest(`/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    })
    return response.data
  },

  async remove(reviewId) {
    const id = Number(reviewId)
    if (!Number.isInteger(id) || id < 1) {
      throw new TypeError('Review ID must be a positive integer')
    }

    return apiRequest(`/reviews/${id}`, { method: 'DELETE' })
  }
}

const normalizeReview = ({ productId, rating, reviewText }) => {
  const normalizedRating = Number(rating)

  if (
    (productId !== undefined &&
      (!Number.isInteger(Number(productId)) || Number(productId) < 1)) ||
    !Number.isInteger(normalizedRating) ||
    normalizedRating < 1 ||
    normalizedRating > 5 ||
    typeof reviewText !== 'string' ||
    !reviewText.trim() ||
    reviewText.trim().length > 2000
  ) {
    throw new TypeError('A review requires a valid product, a 1–5 rating, and text up to 2000 characters')
  }

  return {
    ...(productId === undefined ? {} : { productId: Number(productId) }),
    rating: normalizedRating,
    reviewText: reviewText.trim()
  }
}

export default ReviewService
