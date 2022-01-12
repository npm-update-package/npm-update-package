import { SemVer } from '../semver'
import { toUpdateType } from './toUpdateType'
import { UpdateType } from './UpdateType'

describe('toUpdateType', () => {
  const currentVersion = SemVer.of('1.0.0')

  describe('if both versions are different', () => {
    it('returns UpdateType', () => {
      expect(toUpdateType(currentVersion, SemVer.of('1.0.1'))).toBe(UpdateType.Patch)
      expect(toUpdateType(currentVersion, SemVer.of('1.1.1'))).toBe(UpdateType.Minor)
      expect(toUpdateType(currentVersion, SemVer.of('2.1.1'))).toBe(UpdateType.Major)
    })
  })

  describe('if both versions are same', () => {
    it('throws error', () => {
      expect(() => toUpdateType(currentVersion, SemVer.of('1.0.0'))).toThrow(Error)
    })
  })
})
