import {
  describe,
  expect,
  it
} from '@jest/globals'
import { InvalidArgumentError } from 'commander'
import { parseBooleanOption } from './parseBooleanOption'

describe('parseBooleanOption', () => {
  describe('returns boolean if value is valid', () => {
    it.each([
      ['true', true],
      ['false', false]
    ])('value=%p', (value, expected) => {
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
