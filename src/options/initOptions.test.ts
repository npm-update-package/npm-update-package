import { LogLevel } from '../logger'
import { OutdatedPullRequestStrategy } from '../outdated-package-processor'
import { DependencyType } from '../package-json'
import { PackageManagerName } from '../package-manager'
import { cliOptions } from './cliOptions'
import { createOptions } from './createOptions'
import { initOptions } from './initOptions'
import type { Options } from './Options'

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
    createOptionsMock.mockReturnValue(expected)

    const actual = initOptions()

    expect(actual).toBe(expected)
    expect(createOptionsMock).toBeCalledWith(cliOptions)
  })
})
