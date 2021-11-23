import {
  record,
  string
} from 'io-ts'
import type { TypeOf } from 'io-ts'

export const PackageDependencies = record(string, string)
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type PackageDependencies = TypeOf<typeof PackageDependencies>
export const isPackageDependencies = PackageDependencies.is
