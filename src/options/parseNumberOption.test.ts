import { InvalidArgumentError } from 'commander'
import { parseNumberOption } from './parseNumberOption'

describe('parseNumberOption', () => {
  describe('returns number if value is valid', () => {
    type TestCase = [string, number]
    const cases: TestCase[] = [
      ['0', 0],
      ['1', 1],
      ['-1', -1],
      ['0.1', 0.1]
    ]

    it.each(cases)('value=%p', (value, expected) => {
      const actual = parseNumberOption(value)

      expect(actual).toBe(expected)
    })
  })

  describe('throws error if value is invalid', () => {
    it.each([
      'zero'
    ])('value=%p', (value) => {
      expect(() => parseNumberOption(value)).toThrow(InvalidArgumentError)
    })
  })
})
