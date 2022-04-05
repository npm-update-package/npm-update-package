import {
  isYarnVersions,
  type YarnVersions
} from './YarnVersions'

describe('isYarnVersions', () => {
  describe('returns whether value is YarnVersions', () => {
    interface TestCase {
      value: unknown
      expected: boolean
    }
    const versions: YarnVersions = {
      type: 'inspect',
      data: [
        '1.0.0',
        '2.0.0'
      ]
    }
    const cases: TestCase[] = [
      {
        value: versions,
        expected: true
      },
      {
        value: {
          ...versions,
          type: undefined
        },
        expected: false
      },
      {
        value: {
          ...versions,
          data: undefined
        },
        expected: false
      }
    ]

    it.each(cases)('value=$value', ({ value, expected }) => {
      const actual = isYarnVersions(value)

      expect(actual).toBe(expected)
    })
  })
})
