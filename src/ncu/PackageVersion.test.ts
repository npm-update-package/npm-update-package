import { PackageVersion } from './PackageVersion'

describe('PackageVersion', () => {
  describe('of', () => {
    describe('if version is valid', () => {
      const version = '^1.2.3'

      it('returns new PackageVersion instance', () => {
        const packageVersion = PackageVersion.of(version)
        expect(packageVersion.version).toBe('1.2.3')
        expect(packageVersion.major).toBe(1)
        expect(packageVersion.minor).toBe(2)
        expect(packageVersion.patch).toBe(3)
      })
    })

    describe('if version is invalid', () => {
      const version = ''

      it('throws error', () => {
        expect(() => PackageVersion.of(version)).toThrow(Error)
      })
    })
  })
})
