import {
  describe,
  expect,
  it
} from '@jest/globals'
import { SemVer } from './SemVer'

describe('SemVer', () => {
  describe('of', () => {
    it('returns new SemVer instance if version is valid', () => {
      const actual = SemVer.of('^1.2.3')

      expect(actual.version).toBe('1.2.3')
      expect(actual.major).toBe(1)
      expect(actual.minor).toBe(2)
      expect(actual.patch).toBe(3)
    })

    it('throws error if version is invalid', () => {
      expect(() => SemVer.of('')).toThrow(Error)
    })
  })
})
