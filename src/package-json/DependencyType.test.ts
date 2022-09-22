import { describe, expect, it } from '@jest/globals'
import { isDependencyType, DependencyType } from './DependencyType'

describe('isDependencyType', () => {
  describe('returns whether value is DependencyType', () => {
    it.each([
      [DependencyType.Dependencies, true],
      [DependencyType.DevDependencies, true],
      [DependencyType.PeerDependencies, true],
      [DependencyType.BundledDependencies, true],
      [DependencyType.OptionalDependencies, true],
      ['unknown', false]
    ])('value=%p', (value, expected) => {
      const actual = isDependencyType(value)

      expect(actual).toBe(expected)
    })
  })
})
