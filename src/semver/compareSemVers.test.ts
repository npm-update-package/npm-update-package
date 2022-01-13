import { compareSemVers } from './compareSemVers'
import { SemVer } from './SemVer'
import { SemVerLevel } from './SemVerLevel'

describe('compareSemVers', () => {
  describe('if both versions are different', () => {
    it('returns SemVerLevel', () => {
      expect(compareSemVers(SemVer.of('1.0.0'), SemVer.of('1.0.1'))).toBe(SemVerLevel.Patch)
      expect(compareSemVers(SemVer.of('1.0.0'), SemVer.of('1.1.1'))).toBe(SemVerLevel.Minor)
      expect(compareSemVers(SemVer.of('1.0.0'), SemVer.of('2.1.1'))).toBe(SemVerLevel.Major)
    })
  })

  describe('if both versions are same', () => {
    it('returns undefined', () => {
      expect(compareSemVers(SemVer.of('1.0.0'), SemVer.of('1.0.0'))).toBeUndefined()
    })
  })
})
