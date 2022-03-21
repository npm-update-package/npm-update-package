import { toJSON } from './toJSON'

describe('toJSON', () => {
  describe('returns JSON string', () => {
    interface TestCase {
      value: unknown
      options?: {
        pretty?: boolean
      }
      expected: string
    }
    const value = {
      number: 1,
      string: 'foo'
    }
    const cases: TestCase[] = [
      {
        value,
        options: undefined,
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

    it.each(cases)('value=$value, options=$options', ({ value, options, expected }) => {
      const actual = toJSON(value, options)

      expect(actual).toBe(expected)
    })
  })
})
