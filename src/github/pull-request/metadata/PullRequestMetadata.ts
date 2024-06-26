import {
  array,
  literal,
  string,
  type,
  union,
  type TypeOf
} from 'io-ts'
import { SemVerLevel } from '../../../semver/SemVerLevel.js'

const PullRequestMetadata = type({
  version: string,
  packages: array(type({
    name: string,
    currentVersion: string,
    newVersion: string,
    level: union([literal(SemVerLevel.Major), literal(SemVerLevel.Minor), literal(SemVerLevel.Patch)])
  }))
})
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type PullRequestMetadata = TypeOf<typeof PullRequestMetadata>
export const isPullRequestMetadata = PullRequestMetadata.is
