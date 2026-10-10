import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

const scrypt = promisify(scryptCallback)
const SALT_BYTES = 16
const KEY_BYTES = 64

export const hashPassword = async (password) => {
  if (typeof password !== 'string' || password.length < 8 || password.length > 128) {
    throw new TypeError('Password must be between 8 and 128 characters')
  }

  const salt = randomBytes(SALT_BYTES)
  const derivedKey = await scrypt(password, salt, KEY_BYTES)
  return `${salt.toString('hex')}:${Buffer.from(derivedKey).toString('hex')}`
}

export const verifyPassword = async (password, storedHash) => {
  if (typeof password !== 'string' || typeof storedHash !== 'string') return false

  const [saltHex, keyHex, extra] = storedHash.split(':')
  if (!saltHex || !keyHex || extra !== undefined || !/^[\da-f]+$/i.test(saltHex) || !/^[\da-f]+$/i.test(keyHex)) {
    return false
  }

  const salt = Buffer.from(saltHex, 'hex')
  const expected = Buffer.from(keyHex, 'hex')
  if (salt.length !== SALT_BYTES || expected.length !== KEY_BYTES) return false

  const derivedKey = Buffer.from(await scrypt(password, salt, expected.length))
  return timingSafeEqual(expected, derivedKey)
}
