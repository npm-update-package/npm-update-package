import {
  intersection,
  literal,
  partial,
  string,
  type,
  union
} from 'io-ts'
import type { TypeOf } from 'io-ts'

export const Options = intersection([
  type({
    branchName: string,
    commitMessage: string,
    githubToken: string,
    logLevel: union([literal('info'), literal('debug')]),
    packageManager: union([literal('npm'), literal('yarn')])
  }),
  partial({
    gitUserEmail: string,
    gitUserName: string
  })
])
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Options = TypeOf<typeof Options>
export const isOptions = Options.is
