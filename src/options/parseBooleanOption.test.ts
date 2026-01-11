import assert from 'node:assert'
import {
  describe,
  it
} from 'node:test'
import { InvalidArgumentError } from 'commander'
import { each } from 'test-each'
import { parseBooleanOption } from './parseBooleanOption.js'

await describe('parseBooleanOption', async () => {
  await describe('returns boolean if value is valid', () => {
    const inputs: Array<[value: string, expected: boolean]> = [
      ['true', true],
      ['false', false]
    ]
    each(inputs, ({ title }, [value, expected]) => {
      it(title, () => {
        const actual = parseBooleanOption(value)

        assert.strictEqual(actual, expected)
      })
    })
  })

  await describe('throws error if value is invalid', () => {
    const inputs: string[] = [
      'TRUE',
      'FALSE',
      '',
      'unknown'
    ]
    each(inputs, ({ title }, value) => {
      it(title, () => {
        assert.throws(() => parseBooleanOption(value), InvalidArgumentError)
      })
    })
  })
})
