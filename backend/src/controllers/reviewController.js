import {
  createReview as createReviewInDAO,
  deleteReview as deleteReviewInDAO,
  findProductForReview,
  updateReview as updateReviewInDAO
} from '../dao/reviewDAO.js'

const parsePositiveId = (value) => {
  const id = Number(value)
  return Number.isInteger(id) && id > 0 ? id : null
}

const parseReviewFields = (body) => {
  const rating = Number(body.rating)
  const reviewText = body.reviewText

  if (
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5 ||
    typeof reviewText !== 'string' ||
    !reviewText.trim() ||
    reviewText.trim().length > 2000
  ) {
    return null
  }

  return { rating, reviewText: reviewText.trim() }
}

export const createReview = async (req, res, next) => {
  const productId = parsePositiveId(req.body.productId)
  const fields = parseReviewFields(req.body)

  if (!productId || !fields) {
    return res.status(400).json({
      message: 'Provide a valid product ID, a rating from 1 to 5, and review text up to 2000 characters'
    })
  }

  try {
    const product = await findProductForReview(productId)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    const review = await createReviewInDAO(req.customerId, {
      productId,
      ...fields
    })
    return res.status(201).json({
      message: 'Review submitted successfully',
      data: review
    })
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        message: 'You have already reviewed this product. Update your existing review instead.'
      })
    }
    return next(error)
  }
}

export const updateReview = async (req, res, next) => {
  const reviewId = parsePositiveId(req.params.reviewId)
  const fields = parseReviewFields(req.body)

  if (!reviewId || !fields) {
    return res.status(400).json({
      message: 'Provide a valid review ID, a rating from 1 to 5, and review text up to 2000 characters'
    })
  }

  try {
    const review = await updateReviewInDAO(reviewId, req.customerId, fields)
    if (!review) {
      return res.status(404).json({ message: 'Review not found or not owned by this customer' })
    }

    return res.json({
      message: 'Review updated successfully',
      data: review
    })
  } catch (error) {
    return next(error)
  }
}

export const deleteReview = async (req, res, next) => {
  const reviewId = parsePositiveId(req.params.reviewId)
  if (!reviewId) {
    return res.status(400).json({ message: 'Review ID must be a positive integer' })
  }

  try {
    const deleted = await deleteReviewInDAO(reviewId, req.customerId)
    if (!deleted) {
      return res.status(404).json({ message: 'Review not found or not owned by this customer' })
    }

    return res.json({ message: 'Review deleted successfully' })
  } catch (error) {
    return next(error)
  }
}
