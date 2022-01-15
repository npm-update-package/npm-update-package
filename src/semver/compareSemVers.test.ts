import { compareSemVers } from './compareSemVers'
import { SemVer } from './SemVer'
import { SemVerLevel } from './SemVerLevel'

describe('compareSemVers', () => {
  it('returns SemVerLevel.Major if major versions are different', () => {
    expect(compareSemVers(SemVer.of('1.0.0'), SemVer.of('2.1.1'))).toBe(SemVerLevel.Major)
  })

  it('returns SemVerLevel.Minor if minor versions are different', () => {
    expect(compareSemVers(SemVer.of('1.0.0'), SemVer.of('1.1.1'))).toBe(SemVerLevel.Minor)
  })

  it('returns SemVerLevel.Patch if patch versions are different', () => {
    expect(compareSemVers(SemVer.of('1.0.0'), SemVer.of('1.0.1'))).toBe(SemVerLevel.Patch)
  })

  it('returns undefined if both versions are same', () => {
    expect(compareSemVers(SemVer.of('1.0.0'), SemVer.of('1.0.0'))).toBeUndefined()
  })
})
