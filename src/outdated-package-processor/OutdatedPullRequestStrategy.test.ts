// TODO: Replace Jest with Node.js's test runner

import {
  describe,
  expect,
  it
} from '@jest/globals'
import {
  isOutdatedPullRequestStrategy,
  OutdatedPullRequestStrategy
} from './OutdatedPullRequestStrategy.js'

describe('isOutdatedPullRequestStrategy', () => {
  describe('returns whether value is OutdatedPullRequestStrategy', () => {
    it.each([
      [OutdatedPullRequestStrategy.Create, true],
      [OutdatedPullRequestStrategy.Recreate, true],
      [OutdatedPullRequestStrategy.Skip, true],
      ['unknown', false]
    ])('value=%p', (value, expected) => {
      const actual = isOutdatedPullRequestStrategy(value)

      expect(actual).toBe(expected)
    })
  })
})
