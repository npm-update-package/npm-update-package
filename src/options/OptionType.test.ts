// TODO: Replace Jest with Node.js's test runner

import {
  describe,
  expect,
  it
} from '@jest/globals'
import {
  isOptionType,
  OptionType
} from './OptionType.js'

describe('isOptionType', () => {
  describe('returns whether value is OptionType', () => {
    type TestCase = [unknown, boolean]
    const cases: TestCase[] = [
      [OptionType.Boolean, true],
      [OptionType.Number, true],
      [OptionType.String, true],
      [OptionType.StringArray, true],
      ['unknown', false]
    ]

    it.each(cases)('value=%p', (value, expected) => {
      const actual = isOptionType(value)

      expect(actual).toBe(expected)
    })
  })
})
