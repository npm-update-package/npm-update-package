import { LogLevel } from '../logger'
import { PackageManagerName } from '../package-manager'
import type { CLIOption } from './CLIOption'
import { OptionType } from './OptionType'

export const cliOptions: CLIOption[] = [
  // TODO: remove branch-name option
  {
    name: 'branch-name',
    description: 'Branch name template',
    type: OptionType.String,
    required: false,
    default: 'npm-update-package/{{{packageName}}}/v{{newVersion}}'
  },
  {
    name: 'commit-message',
    description: 'Commit message template',
    type: OptionType.String,
    required: false,
    default: 'chore(deps): {{updateType}} update {{{packageName}}} to v{{newVersion}}'
  },
  {
    name: 'github-token',
    description: 'GitHub token',
    type: OptionType.String,
    required: true
  },
  {
    name: 'log-level',
    description: 'Log level to show',
    type: OptionType.String,
    required: false,
    choices: [
      LogLevel.Off,
      LogLevel.Error,
      LogLevel.Info,
      LogLevel.Debug
    ],
    default: LogLevel.Info
  },
  {
    name: 'package-manager',
    description: 'Package manager of your project',
    type: OptionType.String,
    required: false,
    choices: [
      PackageManagerName.Npm,
      PackageManagerName.Yarn
    ],
    default: PackageManagerName.Npm
  },
  // TODO: remove pull-request-labels option
  {
    name: 'pull-request-labels',
    description: 'Pull request labels',
    type: OptionType.StringArray,
    required: false
  },
  {
    name: 'pull-request-title',
    description: 'Pull request title template',
    type: OptionType.String,
    required: false,
    default: 'chore(deps): {{updateType}} update {{{packageName}}} to v{{newVersion}}'
  }
]
