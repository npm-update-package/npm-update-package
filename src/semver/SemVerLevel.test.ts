import {
  isSemVerLevel,
  SemVerLevel
} from './SemVerLevel'

describe('isSemVerLevel', () => {
  describe('returns whether value is SemVerLevel', () => {
    type TestCase = [unknown, boolean]
    const cases: TestCase[] = [
      [SemVerLevel.Major, true],
      [SemVerLevel.Minor, true],
      [SemVerLevel.Patch, true],
      ['unknown', false]
    ]

    it.each<TestCase>(cases)('value=%p, expected=%p', (value, expected) => {
      expect(isSemVerLevel(value)).toBe(expected)
    })
  })
})
