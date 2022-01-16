import { SemVer } from './SemVer'

describe('SemVer', () => {
  describe('of', () => {
    it('returns new SemVer instance if version is valid', () => {
      const semver = SemVer.of('^1.2.3')
      expect(semver.version).toBe('1.2.3')
      expect(semver.major).toBe(1)
      expect(semver.minor).toBe(2)
      expect(semver.patch).toBe(3)
    })

    it('throws error if version is invalid', () => {
      expect(() => SemVer.of('')).toThrow(Error)
    })
  })
})
