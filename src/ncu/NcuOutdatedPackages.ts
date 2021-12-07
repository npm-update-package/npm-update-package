import {
  record,
  string
} from 'io-ts'
import type { TypeOf } from 'io-ts'

export const NcuOutdatedPackages = record(string, string)
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type NcuOutdatedPackages = TypeOf<typeof NcuOutdatedPackages>
export const isNcuOutdatedPackages = NcuOutdatedPackages.is
