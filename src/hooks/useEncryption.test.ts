import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useEncryption } from './useEncryption'

/** Sets up an unlocked vault and returns the hook plus its stored salt. */
const initialized = (passphrase = 'correct horse battery staple') => {
  const hook = renderHook(() => useEncryption())
  let salt: string | null = null
  act(() => {
    salt = hook.result.current.initialize(passphrase)
  })
  return { ...hook, salt: salt! }
}

describe('initialize', () => {
  it('unlocks the vault', () => {
    const { result } = initialized()

    expect(result.current.isUnlocked).toBe(true)
  })

  it('returns a salt to persist', () => {
    const { salt } = initialized()

    expect(salt).toBeTruthy()
  })

  it('exposes the same salt on the hook', () => {
    const { result, salt } = initialized()

    expect(result.current.salt).toBe(salt)
  })

  it('starts locked before initialization', () => {
    const { result } = renderHook(() => useEncryption())

    expect(result.current.isUnlocked).toBe(false)
    expect(result.current.salt).toBeNull()
  })

  it('generates a different salt each time', () => {
    const first = initialized().salt
    const second = initialized().salt

    expect(first).not.toBe(second)
  })
})

describe('encryptData / decryptData', () => {
  it('round trips a string while unlocked', () => {
    const { result } = initialized()

    let roundTripped: string | null = null
    act(() => {
      const sealed = result.current.encryptData('hearing on the 14th')!
      roundTripped = result.current.decryptData(sealed.ciphertext, sealed.nonce)
    })

    expect(roundTripped).toBe('hearing on the 14th')
  })

  it('refuses to encrypt while locked', () => {
    const { result } = renderHook(() => useEncryption())

    let sealed: unknown
    act(() => {
      sealed = result.current.encryptData('secret')
    })

    expect(sealed).toBeNull()
    expect(result.current.error).toBe('Encryption not unlocked')
  })

  it('refuses to decrypt while locked', () => {
    const { result } = renderHook(() => useEncryption())

    let opened: unknown
    act(() => {
      opened = result.current.decryptData('abc', 'def')
    })

    expect(opened).toBeNull()
    expect(result.current.error).toBe('Encryption not unlocked')
  })

  it('reports a decryption failure rather than returning garbage', () => {
    const { result } = initialized()

    let opened: unknown
    act(() => {
      opened = result.current.decryptData('bm90LXJlYWw=', 'bm90LXJlYWw=')
    })

    expect(opened).toBeNull()
    expect(result.current.error).toBe('Decryption failed')
  })
})

describe('lock', () => {
  it('locks the vault', () => {
    const { result } = initialized()

    act(() => result.current.lock())

    expect(result.current.isUnlocked).toBe(false)
  })

  it('drops the salt from memory', () => {
    const { result } = initialized()

    act(() => result.current.lock())

    expect(result.current.salt).toBeNull()
  })

  it('makes previously readable data unreadable until unlocked again', () => {
    const { result } = initialized()
    let sealed: { ciphertext: string; nonce: string }
    act(() => {
      sealed = result.current.encryptData('secret')!
    })

    act(() => result.current.lock())

    let opened: unknown
    act(() => {
      opened = result.current.decryptData(sealed.ciphertext, sealed.nonce)
    })

    expect(opened).toBeNull()
  })
})

describe('unlock', () => {
  it('unlocks with the correct passphrase and salt', () => {
    const { result, salt } = initialized('my passphrase')
    act(() => result.current.lock())

    let ok: boolean | undefined
    act(() => {
      ok = result.current.unlock('my passphrase', salt)
    })

    expect(ok).toBe(true)
    expect(result.current.isUnlocked).toBe(true)
  })

  it('restores access to data encrypted before locking', () => {
    const { result, salt } = initialized('my passphrase')
    let sealed: { ciphertext: string; nonce: string }
    act(() => {
      sealed = result.current.encryptData('detention hearing')!
    })
    act(() => result.current.lock())

    let opened: string | null = null
    act(() => {
      result.current.unlock('my passphrase', salt)
    })
    act(() => {
      opened = result.current.decryptData(sealed.ciphertext, sealed.nonce)
    })

    expect(opened).toBe('detention hearing')
  })

  it('rejects the wrong passphrase when given test data to verify against', () => {
    const { result, salt } = initialized('right passphrase')
    let sealed: { ciphertext: string; nonce: string }
    act(() => {
      sealed = result.current.encryptData('canary')!
    })
    act(() => result.current.lock())

    let ok: boolean | undefined
    act(() => {
      ok = result.current.unlock('wrong passphrase', salt, sealed.ciphertext, sealed.nonce)
    })

    expect(ok).toBe(false)
    expect(result.current.isUnlocked).toBe(false)
    expect(result.current.error).toBe('Incorrect passphrase')
  })

  it('accepts the right passphrase when verifying against test data', () => {
    const { result, salt } = initialized('right passphrase')
    let sealed: { ciphertext: string; nonce: string }
    act(() => {
      sealed = result.current.encryptData('canary')!
    })
    act(() => result.current.lock())

    let ok: boolean | undefined
    act(() => {
      ok = result.current.unlock('right passphrase', salt, sealed.ciphertext, sealed.nonce)
    })

    expect(ok).toBe(true)
  })

  it('fails cleanly on a malformed salt', () => {
    const { result } = renderHook(() => useEncryption())

    let ok: boolean | undefined
    act(() => {
      ok = result.current.unlock('passphrase', 'not-valid-base64!!!')
    })

    expect(ok).toBe(false)
    expect(result.current.isUnlocked).toBe(false)
  })
})

describe('changePassphrase', () => {
  it('returns a new salt', () => {
    const { result, salt } = initialized('old passphrase')

    let newSalt: string | null = null
    act(() => {
      newSalt = result.current.changePassphrase('old passphrase', 'new passphrase', salt)
    })

    expect(newSalt).toBeTruthy()
    expect(newSalt).not.toBe(salt)
  })

  it('rejects an incorrect current passphrase', () => {
    const { result, salt } = initialized('old passphrase')

    let newSalt: string | null = null
    act(() => {
      newSalt = result.current.changePassphrase('wrong passphrase', 'new one', salt)
    })

    expect(newSalt).toBeNull()
    expect(result.current.error).toBe('Current passphrase incorrect')
  })

  it('encrypts subsequent data under the new key', () => {
    const { result, salt } = initialized('old passphrase')
    let newSalt: string | null = null
    act(() => {
      newSalt = result.current.changePassphrase('old passphrase', 'new passphrase', salt)
    })

    let sealed: { ciphertext: string; nonce: string }
    act(() => {
      sealed = result.current.encryptData('after rotation')!
    })
    act(() => result.current.lock())
    act(() => {
      result.current.unlock('new passphrase', newSalt!)
    })

    let opened: string | null = null
    act(() => {
      opened = result.current.decryptData(sealed.ciphertext, sealed.nonce)
    })

    expect(opened).toBe('after rotation')
  })
})
