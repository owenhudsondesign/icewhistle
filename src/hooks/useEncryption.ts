'use client'

import { useState, useCallback, useMemo } from 'react'
import {
  deriveKey,
  generateSalt,
  encrypt,
  decrypt,
  verifyKey,
} from '@/lib/encryption'
import { encodeBase64, decodeBase64 } from 'tweetnacl-util'

interface EncryptionState {
  isUnlocked: boolean
  error: string | null
}

export function useEncryption() {
  const [state, setState] = useState<EncryptionState>({
    isUnlocked: false,
    error: null,
  })
  const [key, setKey] = useState<Uint8Array | null>(null)
  const [salt, setSalt] = useState<Uint8Array | null>(null)

  /**
   * Initialize encryption with a new passphrase (for first-time setup)
   */
  const initialize = useCallback((passphrase: string) => {
    try {
      const newSalt = generateSalt()
      const derivedKey = deriveKey(passphrase, newSalt)

      setKey(derivedKey)
      setSalt(newSalt)
      setState({ isUnlocked: true, error: null })

      // Return salt encoded for storage
      return encodeBase64(newSalt)
    } catch (error) {
      setState({
        isUnlocked: false,
        error: 'Failed to initialize encryption',
      })
      return null
    }
  }, [])

  /**
   * Unlock encryption with existing passphrase and salt
   */
  const unlock = useCallback(
    (passphrase: string, encodedSalt: string, testCiphertext?: string, testNonce?: string) => {
      try {
        const storedSalt = decodeBase64(encodedSalt)
        const derivedKey = deriveKey(passphrase, storedSalt)

        // Verify key if test data is provided
        if (testCiphertext && testNonce) {
          if (!verifyKey(testCiphertext, testNonce, derivedKey)) {
            setState({ isUnlocked: false, error: 'Incorrect passphrase' })
            return false
          }
        }

        setKey(derivedKey)
        setSalt(storedSalt)
        setState({ isUnlocked: true, error: null })
        return true
      } catch (error) {
        setState({ isUnlocked: false, error: 'Failed to unlock' })
        return false
      }
    },
    []
  )

  /**
   * Lock encryption (clear key from memory)
   */
  const lock = useCallback(() => {
    setKey(null)
    setSalt(null)
    setState({ isUnlocked: false, error: null })
  }, [])

  /**
   * Encrypt data
   */
  const encryptData = useCallback(
    (data: string): { ciphertext: string; nonce: string } | null => {
      if (!key) {
        setState((prev) => ({ ...prev, error: 'Encryption not unlocked' }))
        return null
      }

      try {
        return encrypt(data, key)
      } catch (error) {
        setState((prev) => ({ ...prev, error: 'Encryption failed' }))
        return null
      }
    },
    [key]
  )

  /**
   * Decrypt data
   */
  const decryptData = useCallback(
    (ciphertext: string, nonce: string): string | null => {
      if (!key) {
        setState((prev) => ({ ...prev, error: 'Encryption not unlocked' }))
        return null
      }

      try {
        return decrypt(ciphertext, nonce, key)
      } catch (error) {
        setState((prev) => ({ ...prev, error: 'Decryption failed' }))
        return null
      }
    },
    [key]
  )

  /**
   * Change passphrase (re-encrypt data with new key)
   */
  const changePassphrase = useCallback(
    (
      oldPassphrase: string,
      newPassphrase: string,
      oldSalt: string
    ): string | null => {
      // Verify old passphrase
      const oldSaltBytes = decodeBase64(oldSalt)
      const oldKey = deriveKey(oldPassphrase, oldSaltBytes)

      if (key && !key.every((byte, i) => byte === oldKey[i])) {
        setState((prev) => ({ ...prev, error: 'Current passphrase incorrect' }))
        return null
      }

      // Generate new salt and key
      const newSalt = generateSalt()
      const newKey = deriveKey(newPassphrase, newSalt)

      setKey(newKey)
      setSalt(newSalt)

      return encodeBase64(newSalt)
    },
    [key]
  )

  return {
    ...state,
    salt: salt ? encodeBase64(salt) : null,
    initialize,
    unlock,
    lock,
    encryptData,
    decryptData,
    changePassphrase,
  }
}
