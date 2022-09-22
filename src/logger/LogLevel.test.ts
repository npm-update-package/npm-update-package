import { describe, expect, it } from '@jest/globals'
import { isLogLevel, LogLevel } from './LogLevel'

describe('isLogLevel', () => {
  describe('returns whether value is LogLevel', () => {
    type TestCase = [unknown, boolean]
    const cases: TestCase[] = [
      [LogLevel.Debug, true],
      [LogLevel.Error, true],
      [LogLevel.Fatal, true],
      [LogLevel.Info, true],
      [LogLevel.Off, true],
      [LogLevel.Trace, true],
      [LogLevel.Warn, true],
      ['unknown', false]
    ]

    it.each(cases)('value=%p', (value, expected) => {
      const actual = isLogLevel(value)

      expect(actual).toBe(expected)
    })
  })
})
