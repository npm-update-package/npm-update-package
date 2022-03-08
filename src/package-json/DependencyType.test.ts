import {
  isDependencyType,
  DependencyType
} from './DependencyType'

describe('isDependencyType', () => {
  describe('returns whether value is DependencyType', () => {
    type TestCase = [unknown, boolean]
    const cases: TestCase[] = [
      [DependencyType.Dependencies, true],
      [DependencyType.DevDependencies, true],
      [DependencyType.PeerDependencies, true],
      [DependencyType.OptionalDependencies, true],
      ['unknown', false]
    ]

    it.each<TestCase>(cases)('value=%p, expected=%p', (value, expected) => {
      expect(isDependencyType(value)).toBe(expected)
    })
  })
})
