import { LogLevel } from '../logger'
import { PackageManagerName } from '../package-manager'
import {
  isOptions,
  type Options
} from './Options'

describe('isOptions', () => {
  describe('returns whether value is Options', () => {
    interface TestCase {
      value: unknown
      expected: boolean
    }
    const options: Options = {
      commitMessage: 'test commitMessage',
      githubToken: 'test githubToken',
      logLevel: LogLevel.Info,
      packageManager: PackageManagerName.Npm,
      prTitle: 'test prTitle',
      ignorePackages: ['@npm-update-package/example'],
      prBodyNotes: 'test prBodyNotes',
      reviewers: ['npm-update-package-bot']
    }
    const cases: TestCase[] = [
      {
        value: options,
        expected: true
      },
      {
        value: {
          ...options,
          githubToken: undefined
        },
        expected: false
      }
    ]

    it.each(cases)('value=$value', ({ value, expected }) => {
      const actual = isOptions(value)

      expect(actual).toBe(expected)
    })
  })
})
