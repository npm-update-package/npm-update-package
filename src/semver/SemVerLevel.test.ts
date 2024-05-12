// TODO: Replace Jest with Node.js's test runner

import {
  describe,
  expect,
  it
} from '@jest/globals'
import {
  isSemVerLevel,
  SemVerLevel
} from './SemVerLevel.js'

describe('isSemVerLevel', () => {
  describe('returns whether value is SemVerLevel', () => {
    type TestCase = [unknown, boolean]
    const cases: TestCase[] = [
      [SemVerLevel.Major, true],
      [SemVerLevel.Minor, true],
      [SemVerLevel.Patch, true],
      ['unknown', false]
    ]

    it.each(cases)('value=%p', (value, expected) => {
      const actual = isSemVerLevel(value)

      expect(actual).toBe(expected)
    })
  })
})
