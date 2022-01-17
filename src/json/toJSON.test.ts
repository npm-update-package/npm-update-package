import { toJSON } from './toJSON'

type TestCase = [unknown, string]

describe('toJSON', () => {
  describe('returns not indented JSON string if pretty option is false', () => {
    const cases: TestCase[] = [
      [
        {
          number: 1,
          string: 'string'
        },
        '{"number":1,"string":"string"}'
      ],
      [
        [
          {
            number: 1,
            string: 'string'
          }
        ],
        '[{"number":1,"string":"string"}]'
      ]
    ]

    it.each<TestCase>(cases)('value=%j', (value, expected) => {
      const json = toJSON(value)
      expect(json).toBe(expected)
    })
  })

  describe('returns indented JSON string if pretty option is true', () => {
    const cases: TestCase[] = [
      [
        {
          number: 1,
          string: 'string'
        },
`{
  "number": 1,
  "string": "string"
}`
      ],
      [
        [
          {
            number: 1,
            string: 'string'
          }
        ],
`[
  {
    "number": 1,
    "string": "string"
  }
]`
      ]
    ]

    it.each<TestCase>(cases)('value=%j', (value, expected) => {
      const json = toJSON(value, { pretty: true })
      expect(json).toBe(expected)
    })
  })
})
