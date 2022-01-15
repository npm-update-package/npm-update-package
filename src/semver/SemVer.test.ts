import { SemVer } from './SemVer'

describe('SemVer', () => {
  describe('of', () => {
    describe('if version is valid', () => {
      const version = '^1.2.3'

      it('returns new SemVer instance', () => {
        const semver = SemVer.of(version)
        expect(semver.version).toBe('1.2.3')
        expect(semver.major).toBe(1)
        expect(semver.minor).toBe(2)
        expect(semver.patch).toBe(3)
      })
    })

    describe('if version is invalid', () => {
      const version = ''

      it('throws error', () => {
        expect(() => SemVer.of(version)).toThrow(Error)
      })
    })
  })
})
