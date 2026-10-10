import { createHmac, randomInt, timingSafeEqual } from 'node:crypto'
import {
  createOrder as createOrderRecord,
  listOrdersByCustomer
} from '../src/dao/orderDAO.js'

export const placeOrder = (customerId, customer, quantities) => (
  createOrderRecord(customerId, customer, quantities)
)

export const getOrdersForCustomer = (customerId) => (
  listOrdersByCustomer(customerId)
)

const otpChallenges = new Map()
const otpLifetimeMs = 5 * 60 * 1000

const digestCode = (code) => createHmac('sha256', process.env.SESSION_SECRET).update(code).digest()

const sendOrderOtp = async (email, code) => {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.OTP_FROM_EMAIL
  if (!apiKey || !from) {
    const error = new Error('Email OTP is not configured. Set RESEND_API_KEY and OTP_FROM_EMAIL in the backend .env file.')
    error.statusCode = 503
    throw error
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject: 'Your order verification code',
      text: `Your order verification code is ${code}. It expires in 5 minutes. If you did not request this, you can ignore this email.`
    })
  })

  if (!response.ok) {
    const error = new Error('Could not send the verification email. Check the email provider settings and try again.')
    error.statusCode = 502
    throw error
  }
}

export const requestOrderOtp = async (customerId, customer, quantities) => {
  const key = String(customerId)
  const existing = otpChallenges.get(key)
  if (existing && Date.now() - existing.sentAt < 60_000) {
    const error = new Error('Please wait a minute before requesting another code.')
    error.statusCode = 429
    throw error
  }

  const email = customer.email.trim().toLowerCase()
  const code = String(randomInt(0, 1_000_000)).padStart(6, '0')
  await sendOrderOtp(email, code)
  otpChallenges.set(key, {
    digest: digestCode(code),
    customer: { ...customer, email },
    quantities,
    expiresAt: Date.now() + otpLifetimeMs,
    sentAt: Date.now(),
    attempts: 0
  })
}

export const verifyOrderOtp = async (customerId, code) => {
  const key = String(customerId)
  const challenge = otpChallenges.get(key)
  if (!challenge || challenge.expiresAt <= Date.now()) {
    otpChallenges.delete(key)
    const error = new Error('Your code has expired or was not requested. Request a new code.')
    error.statusCode = 400
    throw error
  }

  const supplied = digestCode(code)
  if (!timingSafeEqual(challenge.digest, supplied)) {
    challenge.attempts += 1
    if (challenge.attempts >= 5) otpChallenges.delete(key)
    const error = new Error(challenge.attempts >= 5 ? 'Too many incorrect attempts. Request a new code.' : 'That code is incorrect. Try again.')
    error.statusCode = 400
    throw error
  }

  otpChallenges.delete(key)
  return createOrderRecord(customerId, challenge.customer, challenge.quantities)
}
