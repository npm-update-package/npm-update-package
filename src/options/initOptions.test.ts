import assert from 'node:assert'
import {
  describe,
  it
} from 'node:test'
import { LogLevel } from '../logger/LogLevel.js'
import { OutdatedPullRequestStrategy } from '../outdated-package-processor/OutdatedPullRequestStrategy.js'
import { DependencyType } from '../package-json/DependencyType.js'
import { PackageManagerName } from '../package-manager/PackageManagerName.js'
import { cliOptions } from './cliOptions.js'
import { createOptions } from './createOptions.js'
import { initOptions } from './initOptions.js'
import type { Options } from './Options.js'

await describe('initOptions', async () => {
  // TODO: Activate when mock.module can use.
  await it.skip('returns Options', ({ mock }) => {
    const createOptionsMock = mock.fn(createOptions)
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
    createOptionsMock.mock.mockImplementation(() => expected)

    const actual = initOptions()

    assert.deepStrictEqual(actual, expected)
    assert.strictEqual(createOptionsMock.mock.callCount(), 1)
    assert.deepStrictEqual(createOptionsMock.mock.calls.map(call => call.arguments), [
      [cliOptions]
    ])
  })
})
