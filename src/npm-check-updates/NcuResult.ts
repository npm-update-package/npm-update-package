import {
  record,
  string,
  type TypeOf
} from 'io-ts'

export const NcuResult = record(string, string)
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type NcuResult = TypeOf<typeof NcuResult>
export const isNcuResult = NcuResult.is
