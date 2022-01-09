import {
  literal,
  string,
  type,
  union,
  type TypeOf
} from 'io-ts'
import { LogLevel } from '../logger'
import { PackageManagerName } from '../package-manager'

const Options = type({
  commitMessage: string,
  githubToken: string,
  logLevel: union([literal(LogLevel.Off), literal(LogLevel.Error), literal(LogLevel.Info), literal(LogLevel.Debug)]),
  packageManager: union([literal(PackageManagerName.Npm), literal(PackageManagerName.Yarn)]),
  pullRequestTitle: string
})

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Options = TypeOf<typeof Options>
export const isOptions = Options.is
