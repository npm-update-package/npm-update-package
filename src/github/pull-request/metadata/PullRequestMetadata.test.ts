// TODO: Replace Jest with Node.js's test runner

import {
  describe,
  expect,
  it
} from '@jest/globals'
import { SemVerLevel } from '../../../semver/SemVerLevel.js'
import { isPullRequestMetadata } from './PullRequestMetadata.js'
import type { PullRequestMetadata } from './PullRequestMetadata.js'

describe('isPullRequestMetadata', () => {
  describe('returns whether value is PullRequestMetadata', () => {
    interface TestCase {
      value: unknown
      expected: boolean
    }
    const metadata: PullRequestMetadata = {
      version: '1.0.0',
      packages: [
        {
          name: '@npm-update-package/example',
          currentVersion: '1.0.0',
          newVersion: '2.0.0',
          level: SemVerLevel.Major
        }
      ]
    }
    const cases: TestCase[] = [
      {
        value: metadata,
        expected: true
      },
      {
        value: {
          ...metadata,
          version: undefined
        },
        expected: false
      },
      {
        value: {
          ...metadata,
          packages: undefined
        },
        expected: false
      }
    ]

    it.each(cases)('value=$value', ({ value, expected }) => {
      const actual = isPullRequestMetadata(value)

      expect(actual).toBe(expected)
    })
  })
})
