import { describe, expect, it } from 'vitest'
import { normalizePlayerIds } from '../../netlify/functions/lib/storage.mjs'

describe('table identity', () => {
  it('normalizes seating order into one group key', () => {
    expect(normalizePlayerIds(['d', 'a', 'c', 'b'])).toBe('a:b:c:d')
    expect(normalizePlayerIds(['a', 'b', 'c', 'd'])).toBe(normalizePlayerIds(['d', 'c', 'b', 'a']))
  })
})
