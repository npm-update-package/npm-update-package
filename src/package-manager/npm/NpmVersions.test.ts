import assert from 'node:assert'
import {
  describe,
  it
} from 'node:test'
import { isNpmVersions } from './NpmVersions.js'
import type { NpmVersions } from './NpmVersions.js'

await describe('isNpmVersions', async () => {
  await describe('returns whether value is NpmVersions', async () => {
    const { each } = await import('test-each')
    const versions: NpmVersions = [
      '1.0.0',
      '2.0.0'
    ]
    const inputs: Array<[value: unknown, expected: boolean]> = [
      [versions, true],
      [{ data: versions }, false]
    ]
    each(inputs, ({ title }, [value, expected]) => {
      void it(title, () => {
        const actual = isNpmVersions(value)

        assert.strictEqual(actual, expected)
      })
    })
  })
})
