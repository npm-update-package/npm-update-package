import assert from 'node:assert'
import {
  describe,
  it
} from 'node:test'
import { isNpmCheckUpdatesResult } from './NpmCheckUpdatesResult.js'
import type { NpmCheckUpdatesResult } from './NpmCheckUpdatesResult.js'

await describe('isNpmCheckUpdatesResult', async () => {
  await describe('returns whether value is NpmCheckUpdatesResult', async () => {
    const { each } = await import('test-each')
    const result: NpmCheckUpdatesResult = {
      '@npm-update-package/example': '1.0.0'
    }
    const inputs: Array<[value: unknown, expected: boolean]> = [
      [result, true],
      [[result], false]
    ]
    each(inputs, ({ title }, [value, expected]) => {
      void it(title, () => {
        const actual = isNpmCheckUpdatesResult(value)

        assert.strictEqual(actual, expected)
      })
    })
  })
})
