/* eslint react-refresh/only-export-components: off */

const MIN_PASSWORD_LENGTH = 8
const MAX_PASSWORD_LENGTH = 128

export const getPasswordError = (password) => {
  if (typeof password !== 'string') return 'Password must be text.'
  if (password.length < MIN_PASSWORD_LENGTH) return 'Password must be at least 8 characters.'
  if (password.length > MAX_PASSWORD_LENGTH) return 'Password must be 128 characters or fewer.'
  return ''
}

export const isValidPassword = (password) => getPasswordError(password) === ''

export const passwordsMatch = (password, confirmation) => (
  typeof password === 'string' && password === confirmation
)

export const getPasswordStrength = (password = '') => {
  if (typeof password !== 'string' || password.length === 0) return 'empty'
  if (!isValidPassword(password)) return 'weak'

  let score = 0
  if (password.length >= 12) score += 1
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1
  if (/\d/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1

  if (score <= 1) return 'weak'
  if (score <= 3) return 'medium'
  return 'strong'
}

const PasswordUtil = {
  MIN_PASSWORD_LENGTH,
  MAX_PASSWORD_LENGTH,
  getPasswordError,
  isValidPassword,
  passwordsMatch,
  getPasswordStrength
}

export default PasswordUtil
