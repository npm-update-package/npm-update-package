import { compareSemVers } from './compareSemVers'
import { SemVer } from './SemVer'
import { SemVerLevel } from './SemVerLevel'

describe('compareSemVers', () => {
  describe('returns SemVerLevel if both versions are different', () => {
    type TestCase = [string, string, SemVerLevel]
    const cases: TestCase[] = [
      [
        '1.0.0', '2.0.0', SemVerLevel.Major
      ],
      [
        '1.0.0', '1.1.0', SemVerLevel.Minor
      ],
      [
        '1.0.0', '1.0.1', SemVerLevel.Patch
      ]
    ]

    it.each(cases)('version1=%p, version2=%p', (version1, version2, expected) => {
      const actual = compareSemVers(SemVer.of(version1), SemVer.of(version2))

      expect(actual).toBe(expected)
    })
  })

  it('returns undefined if both versions are same', () => {
    const actual = compareSemVers(SemVer.of('1.0.0'), SemVer.of('1.0.0'))

    expect(actual).toBeUndefined()
  })
})
