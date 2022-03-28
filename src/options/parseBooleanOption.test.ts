import { InvalidArgumentError } from 'commander'
import { parseBooleanOption } from './parseBooleanOption'

describe('parseBooleanOption', () => {
  describe('returns boolean if value is valid', () => {
    type TestCase = [string, boolean]
    const cases: TestCase[] = [
      ['true', true],
      ['false', false]
    ]

    it.each(cases)('value=%p', (value, expected) => {
      const actual = parseBooleanOption(value)

      expect(actual).toBe(expected)
    })
  })

  describe('throws error if value is invalid', () => {
    it.each([
      'TRUE',
      'FALSE',
      '',
      'unknown'
    ])('value=%p', (value) => {
      expect(() => parseBooleanOption(value)).toThrow(InvalidArgumentError)
    })
  })
})
