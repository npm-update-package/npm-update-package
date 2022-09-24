import {
  describe,
  expect,
  it
} from '@jest/globals'
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

    it.each(cases)('value=%p', (value, expected) => {
      const actual = isPackageManagerName(value)

      expect(actual).toBe(expected)
    })
  })
})
