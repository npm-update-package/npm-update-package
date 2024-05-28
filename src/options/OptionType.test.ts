import assert from 'node:assert'
import {
  describe,
  it
} from 'node:test'
import { each } from 'test-each'
import {
  isOptionType,
  OptionType
} from './OptionType.js'

await describe('isOptionType', async () => {
  await describe('returns whether value is OptionType', async () => {
    const inputs: Array<[value: unknown, expected: boolean]> = [
      [OptionType.Boolean, true],
      [OptionType.Number, true],
      [OptionType.String, true],
      [OptionType.StringArray, true],
      ['unknown', false]
    ]
    each(inputs, ({ title }, [value, expected]) => {
      void it(title, () => {
        const actual = isOptionType(value)

        assert.strictEqual(actual, expected)
      })
    })
  })
})
