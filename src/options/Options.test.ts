import { describe, expect, it } from '@jest/globals'
import { LogLevel } from '../logger'
import { OutdatedPullRequestStrategy } from '../outdated-package-processor'
import { DependencyType } from '../package-json'
import { PackageManagerName } from '../package-manager'
import { isOptions } from './Options'
import type { Options } from './Options'

describe('isOptions', () => {
  describe('returns whether value is Options', () => {
    interface TestCase {
      value: unknown
      expected: boolean
    }
    const options: Options = {
      additionalLabels: ['bot', 'dependencies'],
      commitMessage: 'test commitMessage',
      dependencyTypes: [
        DependencyType.Dependencies,
        DependencyType.DevDependencies,
        DependencyType.PeerDependencies,
        DependencyType.BundledDependencies,
        DependencyType.OptionalDependencies
      ],
      fetchReleaseNotes: true,
      fetchSleepTime: 1000,
      gitUserEmail: 'octocat@example.com',
      gitUserName: 'octocat',
      githubToken: 'test githubToken',
      logLevel: LogLevel.Info,
      outdatedPrStrategy: OutdatedPullRequestStrategy.Recreate,
      packageManager: PackageManagerName.Npm,
      prBodyGithubHost: 'github.test',
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
