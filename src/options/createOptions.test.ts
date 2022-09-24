import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest
} from '@jest/globals'
import { LogLevel } from '../logger'
import { OutdatedPullRequestStrategy } from '../outdated-package-processor'
import { DependencyType } from '../package-json'
import { PackageManagerName } from '../package-manager'
import { cliOptions } from './cliOptions'
import { createOptions } from './createOptions'
import { isOptions } from './Options'
import type { Options } from './Options'

jest.mock('./Options')

describe('createOptions', () => {
  const isOptionsMock = jest.mocked(isOptions)
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
      '--fetch-release-notes',
      'false',
      '--fetch-sleep-time',
      '2000',
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
    jest.resetAllMocks()
    process.argv = argv
  })

  it('returns Options if it is valid', () => {
    isOptionsMock.mockReturnValue(true)

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
      fetchReleaseNotes: false,
      fetchSleepTime: 2000,
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
    expect(actual).toEqual(expected)
  })

  it('throws error if Options is invalid', () => {
    isOptionsMock.mockReturnValue(false)

    expect(() => createOptions(cliOptions)).toThrow(Error)
  })
})
