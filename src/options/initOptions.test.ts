import {
  afterEach,
  describe,
  expect,
  it,
  jest
} from '@jest/globals'
import { LogLevel } from '../logger/LogLevel.js'
import { OutdatedPullRequestStrategy } from '../outdated-package-processor/OutdatedPullRequestStrategy.js'
import { DependencyType } from '../package-json/DependencyType.js'
import { PackageManagerName } from '../package-manager/PackageManagerName.js'
import { cliOptions } from './cliOptions.js'
import { createOptions } from './createOptions.js'
import { initOptions } from './initOptions.js'
import type { Options } from './Options.js'

jest.mock('./createOptions')

describe('initOptions', () => {
  const createOptionsMock = jest.mocked(createOptions)

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('returns Options', () => {
    const expected: Options = {
      commitMessage: 'test commitMessage',
      dependencyTypes: [
        DependencyType.Dependencies,
        DependencyType.DevDependencies,
        DependencyType.PeerDependencies,
        DependencyType.BundledDependencies,
        DependencyType.OptionalDependencies
      ],
      draftPr: true,
      fetchReleaseNotes: true,
      fetchInterval: 1000,
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
    createOptionsMock.mockReturnValue(expected)

    const actual = initOptions()

    expect(actual).toBe(expected)
    expect(createOptionsMock).toHaveBeenCalledWith(cliOptions)
  })
})
