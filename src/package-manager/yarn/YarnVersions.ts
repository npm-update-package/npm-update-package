import {
  array,
  string,
  type,
  type TypeOf
} from 'io-ts'

export const YarnVersions = type({
  type: string,
  data: array(string)
})
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type YarnVersions = TypeOf<typeof YarnVersions>
export const isYarnVersions = YarnVersions.is
