import {
  describe,
  expect,
  it
} from '@jest/globals'
import { isNpmCheckUpdatesResult } from './NpmCheckUpdatesResult'
import type { NpmCheckUpdatesResult } from './NpmCheckUpdatesResult'

describe('isNpmCheckUpdatesResult', () => {
  describe('returns whether value is NpmCheckUpdatesResult', () => {
    interface TestCase {
      value: unknown
      expected: boolean
    }
    const result: NpmCheckUpdatesResult = {
      '@npm-update-package/example': '1.0.0'
    }
    const cases: TestCase[] = [
      {
        value: result,
        expected: true
      },
      {
        value: [result],
        expected: false
      }
    ]

    it.each(cases)('value=$value', ({ value, expected }) => {
      const actual = isNpmCheckUpdatesResult(value)

      expect(actual).toBe(expected)
    })
  })
})
