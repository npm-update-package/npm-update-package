import assert from 'node:assert'
import {
  describe,
  it
} from 'node:test'
import { InvalidArgumentError } from 'commander'
import { each } from 'test-each'
import { parseNumberOption } from './parseNumberOption.js'

await describe('parseNumberOption', async () => {
  await describe('returns number if value is valid', async () => {
    const inputs: Array<[value: string, expected: number]> = [
      ['0', 0],
      ['1', 1],
      ['-1', -1],
      ['0.1', 0.1]
    ]
    each(inputs, ({ title }, [value, expected]) => {
      void it(title, () => {
        const actual = parseNumberOption(value)

        assert.strictEqual(actual, expected)
      })
    })

    await it('throws error if value is invalid', () => {
      assert.throws(() => parseNumberOption('zero'), InvalidArgumentError)
    })
  })
})
