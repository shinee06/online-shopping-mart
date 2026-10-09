import {
  createHmac,
  randomBytes,
  timingSafeEqual
} from 'node:crypto'

const tokenLifetimeSeconds = 60 * 60 * 24

const getSecret = () => {
  const secret = process.env.SESSION_SECRET

  if (!secret || secret.length < 32) {
    throw new Error('SESSION_SECRET must contain at least 32 characters')
  }

  return secret
}

const sign = (value) =>
  createHmac('sha256', getSecret()).update(value).digest('base64url')

export const createAuthToken = (customer) => {
  const payload = Buffer.from(JSON.stringify({
    sub: customer.id,
    email: customer.email,
    exp: Math.floor(Date.now() / 1000) + tokenLifetimeSeconds,
    nonce: randomBytes(12).toString('base64url')
  })).toString('base64url')
  const unsignedToken = payload

  return `${unsignedToken}.${sign(unsignedToken)}`
}

export const verifyAuthToken = (token) => {
  const [payload, signature, extra] = token.split('.')

  if (!payload || !signature || extra) {
    return null
  }

  const expectedSignature = Buffer.from(sign(payload))
  const receivedSignature = Buffer.from(signature)

  if (
    expectedSignature.length !== receivedSignature.length ||
    !timingSafeEqual(expectedSignature, receivedSignature)
  ) {
    return null
  }

  try {
    const claims = JSON.parse(
      Buffer.from(payload, 'base64url').toString('utf8')
    )

    if (
      !Number.isInteger(claims.sub) ||
      typeof claims.exp !== 'number' ||
      claims.exp <= Math.floor(Date.now() / 1000)
    ) {
      return null
    }

    return claims
  } catch {
    return null
  }
}
