import assert from 'node:assert'
import {
  describe,
  it
} from 'node:test'
import {
  type Options,
  toJSON
} from './toJSON.js'

await describe('toJSON', async () => {
  await describe('returns JSON string', async () => {
    const { each } = await import('test-each')
    const value = {
      number: 1,
      string: 'foo'
    }
    const inputs: Array<{
      value: unknown
      options: Options | undefined
      expected: string
    }> = [
      {
        value,
        options: undefined,
        expected: '{"number":1,"string":"foo"}'
      },
      {
        value,
        options: {},
        expected: '{"number":1,"string":"foo"}'
      },
      {
        value,
        options: {
          pretty: false
        },
        expected: '{"number":1,"string":"foo"}'
      },
      {
        value,
        options: {
          pretty: true
        },
        expected:
`{
  "number": 1,
  "string": "foo"
}`
      }
    ]
    each(inputs, ({ title }, { value, options, expected }) => {
      void it(title, () => {
        const actual = toJSON(value, options)

        assert.strictEqual(actual, expected)
      })
    })
  })
})
