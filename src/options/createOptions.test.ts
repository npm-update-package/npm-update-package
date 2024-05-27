import assert from 'node:assert'
import {
  afterEach,
  beforeEach,
  describe,
  it,
  mock
} from 'node:test'
import { LogLevel } from '../logger/LogLevel.js'
import { OutdatedPullRequestStrategy } from '../outdated-package-processor/OutdatedPullRequestStrategy.js'
import { DependencyType } from '../package-json/DependencyType.js'
import { PackageManagerName } from '../package-manager/PackageManagerName.js'
import { cliOptions } from './cliOptions.js'
import { createOptions } from './createOptions.js'
import type { Options } from './Options.js'
import { isOptions } from './Options.js'

await describe('createOptions', async () => {
  const isOptionsMock = mock.fn(isOptions)
  const { argv } = process

  beforeEach(() => {
    process.argv = [
      ...argv.slice(0, 2),
      '--additional-labels',
      'bot',
      'dependencies',
      '--assignees',
      'alice',
      'bob',
      '--assignees-sample-size',
      '1',
      '--commit-message',
      'chore({{{dependencyType}}}): {{{level}}} update {{{packageName}}} from {{{currentVersion}}} to v{{{newVersion}}}',
      '--dependency-types',
      'dependencies',
      'devDependencies',
      '--draft-pr',
      'true',
      '--fetch-interval',
      '2000',
      '--fetch-release-notes',
      'false',
      '--git-user-email',
      'alice@example.com',
      '--git-user-name',
      'alice',
      '--github-token',
      'TEST_TOKEN',
      '--ignore-packages',
      '@types/jest',
      'jest',
      '--log-level',
      'debug',
      '--outdated-pr-strategy',
      'create',
      '--package-manager',
      'yarn',
      '--pr-body-github-host',
      'github.example',
      '--pr-body-notes',
      '**:warning: Please see diff and release notes before merging.**',
      '--pr-title',
      'chore({{{dependencyType}}}): {{{level}}} update {{{packageName}}} from {{{currentVersion}}} to v{{{newVersion}}}',
      '--reviewers',
      'alice',
      'bob',
      '--reviewers-sample-size',
      '1'
    ]
  })

  afterEach(() => {
    isOptionsMock.mock.resetCalls()
    process.argv = argv
  })

  // TODO: Activate when mock.module can use.
  await it.skip('returns Options if it is valid', () => {
    // eslint-disable-next-line lodash/prefer-constant
    isOptionsMock.mock.mockImplementation(() => true)

    const actual = createOptions(cliOptions)

    const expected: Options = {
      additionalLabels: ['bot', 'dependencies'],
      assignees: ['alice', 'bob'],
      assigneesSampleSize: 1,
      commitMessage: 'chore({{{dependencyType}}}): {{{level}}} update {{{packageName}}} from {{{currentVersion}}} to v{{{newVersion}}}',
      dependencyTypes: [
        DependencyType.Dependencies,
        DependencyType.DevDependencies
      ],
      draftPr: true,
      fetchInterval: 2000,
      fetchReleaseNotes: false,
      gitUserEmail: 'alice@example.com',
      gitUserName: 'alice',
      githubToken: 'TEST_TOKEN',
      ignorePackages: ['@types/jest', 'jest'],
      logLevel: LogLevel.Debug,
      outdatedPrStrategy: OutdatedPullRequestStrategy.Create,
      packageManager: PackageManagerName.Yarn,
      prBodyGithubHost: 'github.example',
      prBodyNotes: '**:warning: Please see diff and release notes before merging.**',
      prTitle: 'chore({{{dependencyType}}}): {{{level}}} update {{{packageName}}} from {{{currentVersion}}} to v{{{newVersion}}}',
      reviewers: ['alice', 'bob'],
      reviewersSampleSize: 1
    }
    assert.deepStrictEqual(actual, expected)
  })

  // TODO: Activate when mock.module can use.
  await it.skip('throws error if Options is invalid', () => {
    // eslint-disable-next-line lodash/prefer-constant
    isOptionsMock.mock.mockImplementation(() => false)

    assert.throws(() => createOptions(cliOptions), Error)
  })
})
