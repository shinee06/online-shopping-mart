import { apiRequest } from '../services/api.js'

const parseId = (value, label) => {
  const id = Number(value)
  if (!Number.isInteger(id) || id < 1) {
    throw new TypeError(`${label} must be a positive integer`)
  }
  return id
}

const normalizeReview = ({ productId, rating, reviewText }) => {
  const normalizedRating = Number(rating)
  if (
    (productId !== undefined && (!Number.isInteger(Number(productId)) || Number(productId) < 1)) ||
    !Number.isInteger(normalizedRating) || normalizedRating < 1 || normalizedRating > 5 ||
    typeof reviewText !== 'string' || !reviewText.trim() || reviewText.trim().length > 2000
  ) {
    throw new TypeError('A review requires a valid product, a 1–5 rating, and text up to 2000 characters')
  }
  return {
    ...(productId === undefined ? {} : { productId: Number(productId) }),
    rating: normalizedRating,
    reviewText: reviewText.trim()
  }
}

const ReviewDAO = {
  async getForProduct(productId) {
    const id = parseId(productId, 'Product ID')
    const response = await apiRequest(`/products/${id}/reviews`)
    return response.data
  },

  async create(review) {
    const response = await apiRequest('/reviews', {
      method: 'POST',
      body: JSON.stringify(normalizeReview(review))
    })
    return response.data
  },

  async update(reviewId, review) {
    const id = parseId(reviewId, 'Review ID')
    const response = await apiRequest(`/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(normalizeReview(review))
    })
    return response.data
  },

  async remove(reviewId) {
    const id = parseId(reviewId, 'Review ID')
    return apiRequest(`/reviews/${id}`, { method: 'DELETE' })
  }
}

export default ReviewDAO
