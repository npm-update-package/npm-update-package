import { PackageVersion } from '../values'
import { toUpdateType } from './toUpdateType'

describe('toUpdateType', () => {
  describe('if both versions are different', () => {
    const currentVersion = PackageVersion.of('1.0.0')

    it('returns UpdateType', () => {
      expect(toUpdateType(currentVersion, PackageVersion.of('1.0.1'))).toBe('patch')
      expect(toUpdateType(currentVersion, PackageVersion.of('1.1.1'))).toBe('minor')
      expect(toUpdateType(currentVersion, PackageVersion.of('2.1.1'))).toBe('major')
    })
  })

  describe('if both versions are same', () => {
    it('throws error', () => {
      expect(() => toUpdateType(PackageVersion.of('1.0.0'), PackageVersion.of('1.0.0'))).toThrow(Error)
    })
  })
})
