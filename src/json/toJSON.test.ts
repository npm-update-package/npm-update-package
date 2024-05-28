import assert from 'node:assert'
import {
  describe,
  it
} from 'node:test'
import { each } from 'test-each'
import {
  type Options,
  toJSON
} from './toJSON.js'

await describe('toJSON', async () => {
  await describe('returns JSON string', async () => {
    const value = {
      number: 1,
      string: 'foo'
    }
    const inputs: Array<[options: Options | undefined, expected: string]> = [
      [undefined, '{"number":1,"string":"foo"}'],
      [{}, '{"number":1,"string":"foo"}'],
      [{ pretty: false }, '{"number":1,"string":"foo"}'],
      [{ pretty: true }, `{
  "number": 1,
  "string": "foo"
}`]
    ]
    each(inputs, ({ title }, [options, expected]) => {
      void it(title, () => {
        const actual = toJSON(value, options)

        assert.strictEqual(actual, expected)
      })
    })
  })
})
