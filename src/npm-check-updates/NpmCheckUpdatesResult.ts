import {
  record,
  string,
  type TypeOf
} from 'io-ts'

export const NpmCheckUpdatesResult = record(string, string)
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type NpmCheckUpdatesResult = TypeOf<typeof NpmCheckUpdatesResult>
export const isNpmCheckUpdatesResult = NpmCheckUpdatesResult.is
