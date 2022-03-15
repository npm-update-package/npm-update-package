import {
  array,
  string,
  type TypeOf
} from 'io-ts'

export const NpmVersions = array(string)
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type NpmVersions = TypeOf<typeof NpmVersions>
export const isNpmVersions = NpmVersions.is
