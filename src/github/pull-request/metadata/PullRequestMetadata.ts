import {
  array,
  literal,
  string,
  type,
  union,
  type TypeOf
} from 'io-ts'
import { UpdateType } from '../../../ncu'

const PullRequestMetadata = type({
  version: string,
  packages: array(type({
    name: string,
    currentVersion: string,
    newVersion: string,
    type: union([literal(UpdateType.Major), literal(UpdateType.Minor), literal(UpdateType.Patch)])
  }))
})
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type PullRequestMetadata = TypeOf<typeof PullRequestMetadata>
export const isPullRequestMetadata = PullRequestMetadata.is
