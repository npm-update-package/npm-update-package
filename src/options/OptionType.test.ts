import {
  isOptionType,
  OptionType
} from './OptionType'

describe('isOptionType', () => {
  describe('returns whether value is OptionType', () => {
    type TestCase = [unknown, boolean]
    const cases: TestCase[] = [
      [OptionType.String, true],
      [OptionType.StringArray, true],
      ['unknown', false]
    ]

    it.each<TestCase>(cases)('value=%p, expected=%p', (value, expected) => {
      expect(isOptionType(value)).toBe(expected)
    })
  })
})
