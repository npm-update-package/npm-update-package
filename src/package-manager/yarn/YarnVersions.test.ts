import assert from 'node:assert'
import {
  describe,
  it
} from 'node:test'
import { each } from 'test-each'
import { isYarnVersions } from './YarnVersions.js'
import type { YarnVersions } from './YarnVersions.js'

await describe('isYarnVersions', async () => {
  await describe('returns whether value is YarnVersions', async () => {
    const versions: YarnVersions = {
      type: 'inspect',
      data: [
        '1.0.0',
        '2.0.0'
      ]
    }
    const inputs: Array<[value: unknown, expected: boolean]> = [
      [versions, true],
      [{ ...versions, type: undefined }, false],
      [{ ...versions, data: undefined }, false]
    ]
    each(inputs, ({ title }, [value, expected]) => {
      void it(title, () => {
        const actual = isYarnVersions(value)

        assert.strictEqual(actual, expected)
      })
    })
  })
})
