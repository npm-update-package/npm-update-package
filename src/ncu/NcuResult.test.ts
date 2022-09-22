import { describe, expect, it } from '@jest/globals'
import { isNcuResult } from './NcuResult'
import type { NcuResult } from './NcuResult'

describe('isNcuResult', () => {
  describe('returns whether value is NcuResult', () => {
    interface TestCase {
      value: unknown
      expected: boolean
    }
    const ncuResult: NcuResult = {
      '@npm-update-package/example': '1.0.0'
    }
    const cases: TestCase[] = [
      {
        value: ncuResult,
        expected: true
      },
      {
        value: [ncuResult],
        expected: false
      }
    ]

    it.each(cases)('value=$value', ({ value, expected }) => {
      const actual = isNcuResult(value)

      expect(actual).toBe(expected)
    })
  })
})
