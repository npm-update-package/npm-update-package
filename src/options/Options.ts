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
    packageManager: union([
      literal(PackageManagerName.Npm),
      literal(PackageManagerName.Yarn)
    ]),
    prTitle: string
  }),
  partial({
    assignees: array(string),
    gitUserEmail: string,
    gitUserName: string,
    ignorePackages: array(string),
    prBodyNotes: string,
    reviewers: array(string)
  })
])

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Options = TypeOf<typeof Options>
export const isOptions = Options.is
