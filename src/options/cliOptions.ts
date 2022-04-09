import { OutdatedPullRequestStrategy } from '../core'
import { LogLevel } from '../logger'
import { PackageManagerName } from '../package-manager'
import type { CLIOption } from './CLIOption'
import { OptionType } from './OptionType'

export const cliOptions: CLIOption[] = [
  {
    name: 'assignees',
    description: 'User names to assign to pull request',
    type: OptionType.StringArray,
    required: false
  },
  {
    name: 'assignees-sample-size',
    description: 'How many members to be assigned to assignees',
    type: OptionType.Number,
    required: false
  },
  {
    name: 'commit-message',
    description: 'Commit message template',
    type: OptionType.String,
    required: false,
    default: 'chore(deps): {{{level}}} update {{{packageName}}} to v{{{newVersion}}}'
  },
  {
    name: 'fetch-release-notes',
    description: 'Whether to fetch release notes',
    type: OptionType.Boolean,
    required: false,
    default: true
  },
  {
    name: 'fetch-sleep-time',
    description: 'Sleep time between fetching (ms)',
    type: OptionType.Number,
    required: false,
    default: 1000
  },
  {
    name: 'git-user-email',
    description: 'Git user email',
    type: OptionType.String,
    required: false
  },
  {
    name: 'git-user-name',
    description: 'Git user name',
    type: OptionType.String,
    required: false
  },
  {
    name: 'github-token',
    description: 'GitHub token',
    type: OptionType.String,
    required: true
  },
  {
    name: 'ignore-packages',
    description: 'Package names to ignore',
    type: OptionType.StringArray,
    required: false
  },
  {
    name: 'log-level',
    description: 'Log level to show',
    type: OptionType.String,
    required: false,
    choices: [
      LogLevel.Off,
      LogLevel.Fatal,
      LogLevel.Error,
      LogLevel.Warn,
      LogLevel.Info,
      LogLevel.Debug,
      LogLevel.Trace
    ],
    default: LogLevel.Info
  },
  {
    name: 'outdated-pr-strategy',
    description: 'What to do when outdated pull request exists',
    type: OptionType.String,
    required: false,
    choices: [
      OutdatedPullRequestStrategy.Create,
      OutdatedPullRequestStrategy.Recreate,
      OutdatedPullRequestStrategy.Skip
    ],
    default: OutdatedPullRequestStrategy.Recreate
  },
  {
    name: 'package-manager',
    description: 'Package manager of your project',
    type: OptionType.String,
    required: false,
    choices: [
      PackageManagerName.Npm,
      PackageManagerName.Yarn
    ]
  },
  {
    name: 'pr-body-github-host',
    description: 'GitHub host of pull request body',
    type: OptionType.String,
    required: false,
    default: 'togithub.com'
  },
  {
    name: 'pr-body-notes',
    description: 'Additional notes for Pull request body',
    type: OptionType.String,
    required: false
  },
  {
    name: 'pr-title',
    description: 'Pull request title template',
    type: OptionType.String,
    required: false,
    default: 'chore(deps): {{{level}}} update {{{packageName}}} to v{{{newVersion}}}'
  },
  {
    name: 'reviewers',
    description: 'User names to request reviews',
    type: OptionType.StringArray,
    required: false
  },
  {
    name: 'reviewers-sample-size',
    description: 'How many members to be assigned to reviewers',
    type: OptionType.Number,
    required: false
  }
]
