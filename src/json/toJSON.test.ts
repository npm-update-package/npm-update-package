import { toJSON } from './toJSON'

describe('toJSON', () => {
  describe('returns JSON string', () => {
    interface TestCase {
      value: unknown
      pretty: boolean
      expected: string
    }
    const value = {
      number: 1,
      string: 'foo'
    }
    const cases: TestCase[] = [
      {
        value,
        pretty: false,
        expected: '{"number":1,"string":"foo"}'
      },
      {
        value,
        pretty: true,
        expected:
`{
  "number": 1,
  "string": "foo"
}`
      }
    ]

    it.each(cases)('value=$value, pretty=$pretty', ({ value, pretty, expected }) => {
      const actual = toJSON(value, { pretty })

      expect(actual).toBe(expected)
    })
  })
})
