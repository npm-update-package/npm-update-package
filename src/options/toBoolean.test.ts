import { InvalidArgumentError } from 'commander'
import { toBoolean } from './toBoolean'

describe('toBoolean', () => {
  describe('returns boolean if value is valid', () => {
    type TestCase = [string, boolean]
    const cases: TestCase[] = [
      ['true', true],
      ['false', false]
    ]

    it.each(cases)('value=%p', (value, expected) => {
      const actual = toBoolean(value)

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
      expect(() => toBoolean(value)).toThrow(InvalidArgumentError)
    })
  })
})
