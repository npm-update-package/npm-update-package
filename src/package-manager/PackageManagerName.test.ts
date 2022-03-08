import {
  isPackageManagerName,
  PackageManagerName
} from './PackageManagerName'

describe('isPackageManagerName', () => {
  describe('returns whether value is PackageManagerName', () => {
    type TestCase = [unknown, boolean]
    const cases: TestCase[] = [
      [PackageManagerName.Npm, true],
      [PackageManagerName.Yarn, true],
      ['unknown', false]
    ]

    it.each<TestCase>(cases)('value=%p, expected=%p', (value, expected) => {
      expect(isPackageManagerName(value)).toBe(expected)
    })
  })
})
