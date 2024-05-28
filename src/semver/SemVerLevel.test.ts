import assert from 'node:assert'
import {
  describe,
  it
} from 'node:test'
import { each } from 'test-each'
import {
  isSemVerLevel,
  SemVerLevel
} from './SemVerLevel.js'

await describe('isSemVerLevel', async () => {
  await describe('returns whether value is SemVerLevel', async () => {
    const inputs: Array<[value: unknown, expected: boolean]> = [
      [SemVerLevel.Major, true],
      [SemVerLevel.Minor, true],
      [SemVerLevel.Patch, true],
      ['unknown', false]
    ]
    each(inputs, ({ title }, [value, expected]) => {
      void it(title, () => {
        const actual = isSemVerLevel(value)

        assert.strictEqual(actual, expected)
      })
    })
  })
})
