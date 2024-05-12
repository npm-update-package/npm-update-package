// TODO: Replace Jest with Node.js's test runner

import {
  describe,
  expect,
  it
} from '@jest/globals'
import { isNpmVersions } from './NpmVersions.js'
import type { NpmVersions } from './NpmVersions.js'

describe('isNpmVersions', () => {
  describe('returns whether value is NpmVersions', () => {
    type TestCase = [unknown, boolean]
    const versions: NpmVersions = [
      '1.0.0',
      '2.0.0'
    ]
    const cases: TestCase[] = [
      [versions, true],
      [{ data: versions }, false]
    ]

    it.each(cases)('value=%p', (value, expected) => {
      const actual = isNpmVersions(value)

      expect(actual).toBe(expected)
    })
  })
})
