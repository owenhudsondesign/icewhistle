import { describe, it, expect } from 'vitest'
import {
  deriveKey,
  generateSalt,
  generateNonce,
  encrypt,
  decrypt,
  encryptBytes,
  decryptBytes,
  hashValue,
  verifyKey,
} from './encryption'

const keyFor = (passphrase: string, salt = generateSalt()) => deriveKey(passphrase, salt)

describe('deriveKey', () => {
  it('produces a 32 byte key', () => {
    expect(deriveKey('correct horse battery staple', generateSalt())).toHaveLength(32)
  })

  it('is deterministic for the same passphrase and salt', () => {
    const salt = generateSalt()

    expect(deriveKey('same', salt)).toEqual(deriveKey('same', salt))
  })

  it('produces a different key for a different salt', () => {
    expect(deriveKey('same', generateSalt())).not.toEqual(
      deriveKey('same', generateSalt())
    )
  })

  it('produces a different key for a different passphrase', () => {
    const salt = generateSalt()

    expect(deriveKey('one', salt)).not.toEqual(deriveKey('two', salt))
  })

  it('handles non-ASCII passphrases without truncating them', () => {
    const salt = generateSalt()

    expect(deriveKey('contraseña segura', salt)).not.toEqual(
      deriveKey('contrasena segura', salt)
    )
  })
})

describe('generateSalt / generateNonce', () => {
  it('generates a 16 byte salt', () => {
    expect(generateSalt()).toHaveLength(16)
  })

  it('generates a 24 byte nonce', () => {
    expect(generateNonce()).toHaveLength(24)
  })

  it('does not repeat salts', () => {
    const salts = new Set(
      Array.from({ length: 50 }, () => generateSalt().toString())
    )

    expect(salts.size).toBe(50)
  })

  it('does not repeat nonces', () => {
    const nonces = new Set(
      Array.from({ length: 50 }, () => generateNonce().toString())
    )

    expect(nonces.size).toBe(50)
  })
})

describe('encrypt / decrypt', () => {
  it('round trips a string', () => {
    const key = keyFor('passphrase')
    const { ciphertext, nonce } = encrypt('meet at the clinic at 6', key)

    expect(decrypt(ciphertext, nonce, key)).toBe('meet at the clinic at 6')
  })

  it('does not leave the plaintext readable in the ciphertext', () => {
    const key = keyFor('passphrase')
    const { ciphertext } = encrypt('deportation hearing monday', key)

    expect(ciphertext).not.toContain('deportation')
  })

  it('produces different ciphertext each time for identical input', () => {
    const key = keyFor('passphrase')

    expect(encrypt('same message', key).ciphertext).not.toBe(
      encrypt('same message', key).ciphertext
    )
  })

  it('refuses to decrypt with the wrong key', () => {
    const { ciphertext, nonce } = encrypt('secret', keyFor('right'))

    expect(() => decrypt(ciphertext, nonce, keyFor('wrong'))).toThrow(
      /Decryption failed/
    )
  })

  it('refuses to decrypt with the wrong nonce', () => {
    const key = keyFor('passphrase')
    const { ciphertext } = encrypt('secret', key)
    const otherNonce = encrypt('unrelated', key).nonce

    expect(() => decrypt(ciphertext, otherNonce, key)).toThrow(/Decryption failed/)
  })

  it('refuses to decrypt tampered ciphertext', () => {
    const key = keyFor('passphrase')
    const { ciphertext, nonce } = encrypt('transfer approved', key)
    const flipped =
      ciphertext.slice(0, 4) + (ciphertext[4] === 'A' ? 'B' : 'A') + ciphertext.slice(5)

    expect(() => decrypt(flipped, nonce, key)).toThrow()
  })

  it('round trips unicode and emoji intact', () => {
    const key = keyFor('passphrase')
    const message = 'Está bien — 我们安全 🏠'
    const { ciphertext, nonce } = encrypt(message, key)

    expect(decrypt(ciphertext, nonce, key)).toBe(message)
  })

  it('round trips an empty string', () => {
    const key = keyFor('passphrase')
    const { ciphertext, nonce } = encrypt('', key)

    expect(decrypt(ciphertext, nonce, key)).toBe('')
  })
})

describe('encryptBytes / decryptBytes', () => {
  it('round trips binary data', () => {
    const key = keyFor('passphrase')
    const data = new Uint8Array([0, 1, 2, 250, 251, 255])
    const { ciphertext, nonce } = encryptBytes(data, key)

    expect(decryptBytes(ciphertext, nonce, key)).toEqual(data)
  })

  it('throws on the wrong key rather than returning garbage', () => {
    const data = new Uint8Array([1, 2, 3])
    const { ciphertext, nonce } = encryptBytes(data, keyFor('right'))

    expect(() => decryptBytes(ciphertext, nonce, keyFor('wrong'))).toThrow(
      /Decryption failed/
    )
  })

  it('round trips an empty buffer', () => {
    const key = keyFor('passphrase')
    const { ciphertext, nonce } = encryptBytes(new Uint8Array([]), key)

    expect(decryptBytes(ciphertext, nonce, key)).toEqual(new Uint8Array([]))
  })
})

describe('hashValue', () => {
  it('is deterministic', () => {
    expect(hashValue('device-abc')).toBe(hashValue('device-abc'))
  })

  it('differs for different inputs', () => {
    expect(hashValue('device-abc')).not.toBe(hashValue('device-abd'))
  })

  it('does not echo the input back', () => {
    expect(hashValue('02139')).not.toContain('02139')
  })
})

describe('verifyKey', () => {
  it('accepts the correct key', () => {
    const key = keyFor('passphrase')
    const { ciphertext, nonce } = encrypt('data', key)

    expect(verifyKey(ciphertext, nonce, key)).toBe(true)
  })

  it('rejects the wrong key', () => {
    const { ciphertext, nonce } = encrypt('data', keyFor('right'))

    expect(verifyKey(ciphertext, nonce, keyFor('wrong'))).toBe(false)
  })

  it('returns false instead of throwing on malformed input', () => {
    expect(verifyKey('not-base64!!', 'also-bad!!', keyFor('passphrase'))).toBe(false)
  })
})
