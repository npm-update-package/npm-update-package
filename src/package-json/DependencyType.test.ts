import assert from 'node:assert'
import {
  describe,
  it
} from 'node:test'
import { each } from 'test-each'
import {
  isDependencyType,
  DependencyType
} from './DependencyType.js'

await describe('isDependencyType', async () => {
  await describe('returns whether value is DependencyType', async () => {
    const inputs: Array<[value: unknown, expected: boolean]> = [
      [DependencyType.Dependencies, true],
      [DependencyType.DevDependencies, true],
      [DependencyType.PeerDependencies, true],
      [DependencyType.BundledDependencies, true],
      [DependencyType.OptionalDependencies, true],
      ['unknown', false]
    ]
    each(inputs, ({ title }, [value, expected]) => {
      void it(title, () => {
        const actual = isDependencyType(value)

        assert.strictEqual(actual, expected)
      })
    })
  })
})
