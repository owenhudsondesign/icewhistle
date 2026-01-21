import { secretbox, randomBytes, hash } from 'tweetnacl'
import { encodeBase64, decodeBase64, decodeUTF8, encodeUTF8 } from 'tweetnacl-util'

const KEY_LENGTH = secretbox.keyLength
const NONCE_LENGTH = secretbox.nonceLength

/**
 * Derive an encryption key from a passphrase using a simple hash-based approach.
 * Note: For production, consider using Argon2 or PBKDF2 for stronger key derivation.
 */
export function deriveKey(passphrase: string, salt: Uint8Array): Uint8Array {
  // decodeUTF8 converts string to Uint8Array
  const passphraseBytes = decodeUTF8(passphrase)
  const combined = new Uint8Array(passphraseBytes.length + salt.length)
  combined.set(passphraseBytes)
  combined.set(salt, passphraseBytes.length)

  // Use SHA-512 hash and take first 32 bytes for the key
  const hashed = hash(combined)
  return hashed.slice(0, KEY_LENGTH)
}

/**
 * Generate a random salt for key derivation
 */
export function generateSalt(): Uint8Array {
  return randomBytes(16)
}

/**
 * Generate a random nonce for encryption
 */
export function generateNonce(): Uint8Array {
  return randomBytes(NONCE_LENGTH)
}

/**
 * Encrypt a string with the given key
 */
export function encrypt(
  data: string,
  key: Uint8Array
): { ciphertext: string; nonce: string } {
  const nonce = generateNonce()
  // decodeUTF8 converts string to Uint8Array
  const messageUint8 = decodeUTF8(data)
  const encrypted = secretbox(messageUint8, nonce, key)

  return {
    ciphertext: encodeBase64(encrypted),
    nonce: encodeBase64(nonce),
  }
}

/**
 * Decrypt a ciphertext with the given key and nonce
 */
export function decrypt(
  ciphertext: string,
  nonce: string,
  key: Uint8Array
): string {
  const decrypted = secretbox.open(
    decodeBase64(ciphertext),
    decodeBase64(nonce),
    key
  )

  if (!decrypted) {
    throw new Error('Decryption failed - invalid key or corrupted data')
  }

  // encodeUTF8 converts Uint8Array to string
  return encodeUTF8(decrypted)
}

/**
 * Encrypt binary data (for file encryption)
 */
export function encryptBytes(
  data: Uint8Array,
  key: Uint8Array
): { ciphertext: Uint8Array; nonce: Uint8Array } {
  const nonce = generateNonce()
  const encrypted = secretbox(data, nonce, key)

  return {
    ciphertext: encrypted,
    nonce,
  }
}

/**
 * Decrypt binary data
 */
export function decryptBytes(
  ciphertext: Uint8Array,
  nonce: Uint8Array,
  key: Uint8Array
): Uint8Array {
  const decrypted = secretbox.open(ciphertext, nonce, key)

  if (!decrypted) {
    throw new Error('Decryption failed - invalid key or corrupted data')
  }

  return decrypted
}

/**
 * Hash a value (for device fingerprints, neighborhood hashes, etc.)
 */
export function hashValue(value: string): string {
  // decodeUTF8 converts string to Uint8Array
  const bytes = decodeUTF8(value)
  const hashed = hash(bytes)
  return encodeBase64(hashed)
}

/**
 * Verify if encrypted data can be decrypted with the given key
 */
export function verifyKey(
  ciphertext: string,
  nonce: string,
  key: Uint8Array
): boolean {
  try {
    const decrypted = secretbox.open(
      decodeBase64(ciphertext),
      decodeBase64(nonce),
      key
    )
    return decrypted !== null
  } catch {
    return false
  }
}
