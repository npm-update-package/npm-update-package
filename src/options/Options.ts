import {
  array,
  boolean,
  intersection,
  literal,
  number,
  partial,
  string,
  type,
  union,
  type TypeOf
} from 'io-ts'
import { OutdatedPullRequestStrategy } from '../core'
import { LogLevel } from '../logger'
import { PackageManagerName } from '../package-manager'

const Options = intersection([
  type({
    commitMessage: string,
    fetchReleaseNotes: boolean,
    fetchSleepTime: number,
    githubToken: string,
    logLevel: union([
      literal(LogLevel.Off),
      literal(LogLevel.Fatal),
      literal(LogLevel.Error),
      literal(LogLevel.Warn),
      literal(LogLevel.Info),
      literal(LogLevel.Debug),
      literal(LogLevel.Trace)
    ]),
    outdatedPrStrategy: union([
      literal(OutdatedPullRequestStrategy.Create),
      literal(OutdatedPullRequestStrategy.Recreate),
      literal(OutdatedPullRequestStrategy.Skip)
    ]),
    prBodyGithubHost: string,
    prTitle: string
  }),
  partial({
    assignees: array(string),
    assigneesSampleSize: number,
    gitUserEmail: string,
    gitUserName: string,
    ignorePackages: array(string),
    packageManager: union([
      literal(PackageManagerName.Npm),
      literal(PackageManagerName.Yarn)
    ]),
    prBodyNotes: string,
    reviewers: array(string),
    reviewersSampleSize: number
  })
])

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Options = TypeOf<typeof Options>
export const isOptions = Options.is
