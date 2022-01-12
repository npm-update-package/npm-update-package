import {
  SemVer,
  SemVerLevel
} from '../semver'
import { compareSemVers } from './compareSemVers'

describe('compareSemVers', () => {
  describe('if both versions are different', () => {
    it('returns SemVerLevel', () => {
      expect(compareSemVers(SemVer.of('1.0.0'), SemVer.of('1.0.1'))).toBe(SemVerLevel.Patch)
      expect(compareSemVers(SemVer.of('1.0.0'), SemVer.of('1.1.1'))).toBe(SemVerLevel.Minor)
      expect(compareSemVers(SemVer.of('1.0.0'), SemVer.of('2.1.1'))).toBe(SemVerLevel.Major)
    })
  })

  describe('if both versions are same', () => {
    it('throws error', () => {
      expect(() => compareSemVers(SemVer.of('1.0.0'), SemVer.of('1.0.0'))).toThrow(Error)
    })
  })
})
