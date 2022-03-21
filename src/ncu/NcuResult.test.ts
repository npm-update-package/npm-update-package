import { isNcuResult } from './NcuResult'

describe('isNcuResult', () => {
  describe('returns whether value is NcuResult', () => {
    interface TestCase {
      value: unknown
      expected: boolean
    }
    const cases: TestCase[] = [
      {
        value: {
          '@npm-update-package/example': '1.0.0'
        },
        expected: true
      },
      {
        value: JSON.stringify({
          '@npm-update-package/example': '1.0.0'
        }),
        expected: false
      },
      {
        value: [
          {
            '@npm-update-package/example': '1.0.0'
          }
        ],
        expected: false
      }
    ]

    it.each(cases)('value=$value', ({ value, expected }) => {
      const actual = isNcuResult(value)

      expect(actual).toBe(expected)
    })
  })
})
