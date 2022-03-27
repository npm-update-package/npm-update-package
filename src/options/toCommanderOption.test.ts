import type { CLIOption } from './CLIOption'
import { OptionType } from './OptionType'
import { toCommanderOption } from './toCommanderOption'

describe('toCommanderOption', () => {
  describe('returns Commander Option', () => {
    interface TestCase {
      cliOption: CLIOption
      expected: {
        name: string
        flags: string
        description: string
        required: boolean
        optional: boolean
        variadic: boolean
        short?: string
        long: string
        defaultValue?: number | string
        argChoices?: string[]
      }
    }
    const cases: TestCase[] = [
      // required number
      {
        cliOption: {
          name: 'required-number',
          description: 'required number',
          type: OptionType.Number,
          required: true
        },
        expected: {
          name: 'required-number',
          flags: '--required-number <value>',
          description: 'required number',
          required: true,
          optional: false,
          variadic: false,
          long: '--required-number'
        }
      },
      // required string
      {
        cliOption: {
          name: 'required-string',
          description: 'required string',
          type: OptionType.String,
          required: true
        },
        expected: {
          name: 'required-string',
          flags: '--required-string <value>',
          description: 'required string',
          required: true,
          optional: false,
          variadic: false,
          long: '--required-string'
        }
      },
      // required string array
      {
        cliOption: {
          name: 'required-string-array',
          description: 'required string array',
          type: OptionType.StringArray,
          required: true
        },
        expected: {
          name: 'required-string-array',
          flags: '--required-string-array <values...>',
          description: 'required string array',
          required: true,
          optional: false,
          variadic: true,
          long: '--required-string-array'
        }
      },
      // optional number
      {
        cliOption: {
          name: 'optional-number',
          description: 'optional number',
          type: OptionType.Number,
          required: false,
          default: 1
        },
        expected: {
          name: 'optional-number',
          flags: '--optional-number [value]',
          description: 'optional number',
          required: false,
          optional: true,
          variadic: false,
          long: '--optional-number',
          defaultValue: 1
        }
      },
      // optional string
      {
        cliOption: {
          name: 'optional-string',
          description: 'optional string',
          type: OptionType.String,
          required: false,
          default: 'default'
        },
        expected: {
          name: 'optional-string',
          flags: '--optional-string [value]',
          description: 'optional string',
          required: false,
          optional: true,
          variadic: false,
          long: '--optional-string',
          defaultValue: 'default'
        }
      },
      // TODO: optional string array
      /*
      {
        cliOption: {
          name: 'optional-string-array',
          description: 'optional string array',
          type: OptionType.StringArray,
          required: false,
          default: ['default']
        },
        expected: {
          name: 'optional-string-array',
          flags: '--optional-string-array [values...]',
          description: 'optional string-array',
          required: false,
          optional: true,
          variadic: false,
          long: '--optional-string-array',
          defaultValue: ['default']
        }
      },
      */

      // has choices
      {
        cliOption: {
          name: 'has-choices',
          description: 'has choices',
          type: OptionType.String,
          required: false,
          choices: [
            'foo',
            'bar'
          ],
          default: 'foo'
        },
        expected: {
          name: 'has-choices',
          flags: '--has-choices [value]',
          description: 'has choices',
          required: false,
          optional: true,
          variadic: false,
          long: '--has-choices',
          defaultValue: 'foo',
          argChoices: [
            'foo',
            'bar'
          ]
        }
      }
    ]

    it.each(cases)('cliOption=$cliOption', ({ cliOption, expected }) => {
      const actual = toCommanderOption(cliOption)

      expect(actual.name()).toBe(expected.name)
      expect(actual.flags).toBe(expected.flags)
      expect(actual.description).toBe(expected.description)
      expect(actual.required).toBe(expected.required)
      expect(actual.optional).toBe(expected.optional)
      expect(actual.variadic).toBe(expected.variadic)
      expect(actual.short).toBe(expected.short)
      expect(actual.long).toBe(expected.long)
      expect(actual.defaultValue).toBe(expected.defaultValue)
      expect(actual.argChoices).toEqual(expected.argChoices)
    })
  })
})
