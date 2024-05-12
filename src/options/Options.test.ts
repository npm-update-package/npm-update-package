// TODO: Replace Jest with Node.js's test runner

import {
  describe,
  expect,
  it
} from '@jest/globals'
import { LogLevel } from '../logger/LogLevel.js'
import { OutdatedPullRequestStrategy } from '../outdated-package-processor/OutdatedPullRequestStrategy.js'
import { DependencyType } from '../package-json/DependencyType.js'
import { PackageManagerName } from '../package-manager/PackageManagerName.js'
import { isOptions } from './Options.js'
import type { Options } from './Options.js'

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
      draftPr: true,
      fetchInterval: 1000,
      fetchReleaseNotes: true,
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
